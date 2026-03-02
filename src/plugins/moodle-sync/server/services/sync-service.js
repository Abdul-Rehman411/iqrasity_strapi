'use strict';

const CUSTOM_API_URL = 'https://learn.iqrasity.org/iq_api.php';
const CUSTOM_API_TOKEN = 'iqSyncSec2026Next';
const MOODLE_URL = 'https://learn.iqrasity.org';
const MOODLE_TOKEN = 'bfa54fc57e132203b185b9783a958076';

module.exports = ({ strapi }) => {
  let isSyncing = false;
  let autoSyncTimer = null;
  let lastSyncTime = 0;

  const log = (msg, type = 'info') => {
    strapi.log[type](`[🔄 MOODLE-SYNC] ${msg}`);
  };
  
  const formatInterval = (ms) => {
    if (ms >= 86400000) return `${ms / 86400000}h`;
    if (ms >= 3600000) return `${ms / 3600000}h`;
    if (ms >= 60000) return `${ms / 60000}m`;
    return `${ms / 1000}s`;
  };

  const syncService = {
    async initAutoSync() {
      log('Initialization starting. Loading settings...');
      
      const settings = await syncService.getSettings();
      log(`Settings loaded: ${JSON.stringify(settings)}`);
      
      if (settings.enabled) {
        log('Auto-sync is enabled. Starting scheduler...');
        syncService.startAutoSync(settings.interval);
      } else {
        log('Auto-sync is disabled. Scheduler idle.');
      }
    },

    startAutoSync(interval) {
      if (autoSyncTimer) clearInterval(autoSyncTimer);
      
      const intervalMs = Math.max(10000, interval); // Min 10s
      log(`Auto-sync scheduled (Interval: ${intervalMs}ms)`);

      autoSyncTimer = setInterval(async () => {
         // SAFETY DOUBLE-CHECK: Fetch settings again to ensure we are still enabled
         const currentSettings = await syncService.getSettings();
         if (!currentSettings.enabled) {
             log('Auto-sync is disabled in settings. Stopping active timer.', 'warn');
             syncService.stopAutoSync();
             return;
         }

         try {
            log('Automated Sync Triggered', 'info');
            await syncService.syncAll();
         } catch (err) {
            log(`Auto Sync Error: ${err.message}`, 'error');
         }
      }, intervalMs);
    },

    stopAutoSync() {
      if (autoSyncTimer) {
        clearInterval(autoSyncTimer);
        autoSyncTimer = null;
        log('Auto-sync stopped (Timer Cleared).');
      }
    },

    async getSettings() {
      const pluginStore = strapi.store({
        type: 'plugin',
        name: 'moodle-sync',
      });

      const settings = await pluginStore.get({ key: 'settings' });
      log(`[DB-READ] Raw settings from store: ${JSON.stringify(settings)}`);
      
      if (!settings) {
        log('No settings found in DB. Using defaults.');
        return { enabled: false, interval: 30000 };
      }

      // Handle both Boolean and String 'true'/'false' from DB
      const isEnabled = settings.enabled === true || settings.enabled === 'true' || settings.enabled === 1;

      return {
        enabled: isEnabled,
        interval: parseInt(settings.interval) || 30000
      };
    },

    async updateSettings(newSettings) {
      log(`Settings update received: ${JSON.stringify(newSettings)}`);
      
      const pluginStore = strapi.store({
        type: 'plugin',
        name: 'moodle-sync',
      });

      const prevSettings = await syncService.getSettings();
      const settings = {
        enabled: newSettings.hasOwnProperty('enabled') ? newSettings.enabled : prevSettings.enabled,
        interval: newSettings.hasOwnProperty('interval') ? newSettings.interval : prevSettings.interval,
      };
      
      await pluginStore.set({ key: 'settings', value: settings });
      log('Settings successfully persisted to database.');

      // Log all setting changes
      if (newSettings.hasOwnProperty('enabled')) {
        if (settings.enabled) {
          log('✓ Auto-sync ENABLED by user', 'info');
        } else {
          log('✗ Auto-sync DISABLED by user', 'warn');
        }
      }
      
      if (newSettings.hasOwnProperty('interval') && newSettings.interval !== prevSettings.interval) {
        log(`⏱ Sync interval changed: ${formatInterval(prevSettings.interval)} → ${formatInterval(settings.interval)}`, 'info');
      }

      // Apply changes immediately
      if (settings.enabled) {
        // Restart with new interval
        syncService.startAutoSync(settings.interval);
      } else {
        syncService.stopAutoSync();
      }

      return settings;
    },

    async syncAll() {
      if (isSyncing) {
        log('Sync already in progress. Skipping.', 'warn');
        return;
      }

      // RATE LIMITING
      const now = Date.now();
      if (now - lastSyncTime < 15000) {
        log('Skipping sync: Rate limit cooldown (15s).', 'warn');
        return;
      }

      isSyncing = true;
      try {
        const catResult = await syncService.syncCategories();
        const courseResult = await syncService.syncCourses();
        lastSyncTime = Date.now();
        return { categories: catResult, courses: courseResult };
      } finally {
        isSyncing = false;
      }
    },

    async syncCategories() {
      log('Starting Categories Synchronization');
      
      try {
        // 1. Fetch from Moodle
        const params = new URLSearchParams({
          wstoken: MOODLE_TOKEN,
          wsfunction: 'core_course_get_categories',
          moodlewsrestformat: 'json'
        });

        log(`Fetching categories from Moodle... (${MOODLE_URL})`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${MOODLE_URL}/webservice/rest/server.php?${params}`, {
          headers: { 'User-Agent': 'Strapi/1.0.0' },
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error(`Moodle API returned HTTP ${response.status}`);
        }

        const categories = await response.json();
        if (categories.exception) {
          throw new Error(`Moodle API Error: ${categories.message}`);
        }

        const visibleCategories = categories.filter(c => c.visible === 1);
        log(`Found ${visibleCategories.length} visible categories.`);

        // 2. Fetch Existing from Strapi
        const strapiCategories = await strapi.documents('api::course-category.course-category').findMany({
          fields: ['moodle_id', 'name', 'description', 'slug'],
        });
        
        log(`Fetched ${strapiCategories.length} existing categories.`);

        const strapiMap = new Map();
        strapiCategories.forEach(c => {
          if (c.moodle_id) strapiMap.set(String(c.moodle_id), c);
        });

        const processedMoodleIds = new Set();
        let created = 0, updated = 0, skipped = 0;

        // 3. Sync Loop
        for (const cat of visibleCategories) {
          const mId = String(cat.id);
          processedMoodleIds.add(mId);
          const existing = strapiMap.get(mId);

          const name = syncService.decodeHtml(cat.name);
          const description = cat.description || '';

          if (!existing) {
            // CREATE
            await strapi.documents('api::course-category.course-category').create({
              data: {
                name,
                moodle_id: cat.id,
                description,
                slug: syncService.slugify(name),
              },
              status: 'published'
            });
            created++;
          } else {
            // CHANGE DETECTION
            const changedFields = {};
            if (name !== existing.name) changedFields.name = name;
            if (description !== existing.description) changedFields.description = description;

            if (Object.keys(changedFields).length > 0) {
              log(`Updating category [${mId}] ${name} — changed: ${Object.keys(changedFields).join(', ')}`);
              await strapi.documents('api::course-category.course-category').update({
                documentId: existing.documentId,
                data: changedFields,
              });
              updated++;
            } else {
              skipped++;
            }
          }
        }

        // 4. Handle Orphans (Unpublish items no longer in Moodle)
        let unpublished = 0;
        for (const [mId, sCat] of strapiMap) {
          if (!processedMoodleIds.has(mId)) {
            await strapi.documents('api::course-category.course-category').unpublish({
              documentId: sCat.documentId,
            });
            unpublished++;
          }
        }

        return { created, updated, unpublished, skipped };

      } catch (error) {
        log(`Categories Error: ${error.message}`, 'error');
        if (error.cause) log(`Cause: ${error.cause}`, 'error');
        throw error;
      }
    },

    async syncCourses() {
      log('Starting Courses Synchronization');

      try {
        // 1. Fetch from Moodle
        log(`Fetching courses from Moodle... (${CUSTOM_API_URL})`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(`${CUSTOM_API_URL}?action=courses`, {
          headers: { 
            'X-IQ-TOKEN': CUSTOM_API_TOKEN,
            'User-Agent': 'Strapi/1.0.0'
          },
          signal: controller.signal
        });
        clearTimeout(timeout);
        const json = await response.json();
        
        if (json.status !== 'success') throw new Error(json.message);
        const moodleCourses = json.data || [];
        log(`Found ${moodleCourses.length} courses from Moodle.`);

        // 2. Fetch Data dependencies
        const strapiCourses = await strapi.documents('api::course.course').findMany({
          fields: [
            'moodle_course_id', 
            'title', 
            'shortname', 
            'slug',
            'certificate_type'
          ],
          populate: ['languages', 'course_category']
        });
        
        const categories = await strapi.documents('api::course-category.course-category').findMany({
          fields: ['moodle_id']
        });
        const catMap = new Map();
        categories.forEach(c => catMap.set(parseInt(c.moodle_id), c.documentId));

        const EnglishLang = await strapi.documents('api::language.language').findFirst({
          filters: { name: 'English' }
        });

        const strapiMap = new Map();
        strapiCourses.forEach(c => {
          if (c.moodle_course_id) strapiMap.set(parseInt(c.moodle_course_id), c);
        });

        let created = 0, updated = 0, skipped = 0;
        const seenMoodleIds = new Set();

        // 3. Sync Loop
        for (const mCourse of moodleCourses) {
          const mId = parseInt(mCourse.id);
          seenMoodleIds.add(mId);
          const existing = strapiMap.get(mId);

          const title = syncService.decodeHtml(mCourse.fullname);
          const catDocId = catMap.get(parseInt(mCourse.category_id));

          if (!catDocId) {
            log(`Skipping ${title} - Category ${mCourse.category_id} not found.`, 'warn');
            skipped++;
            continue;
          }

          // const price = mCourse.price === 'FREE' ? 0 : parseFloat(mCourse.price) || 0;
          const short_description = (mCourse.summary || `Learn ${title}`).substring(0, 300);

          if (!existing) {
            // ── CREATE: Full payload for new courses ──
            const createPayload = {
              title,
              shortname: mCourse.shortname,
              moodle_course_id: mId,
              course_category: catDocId,
              short_description,
              enrolled_count: String(mCourse.enrolled_students || 0),
              // price,
              // currency: mCourse.currency_symbol || '$',
              total_duration_hours: parseInt(mCourse.duration_hours) || null,
              level: (mCourse.level || 'beginner').toLowerCase(),
              certificate_type: 'none',
              languages: EnglishLang ? [EnglishLang.documentId] : [],
              slug: `${mId}-${syncService.slugify(title)}`,
            };

            await strapi.documents('api::course.course').create({ 
              data: createPayload,
              status: 'published'
            });
            created++;
          } else {
            // ── UPDATE: Granular field-level change detection ──
            // NEVER touch: currency, enrolled_count, short_description, level, total_duration_hours
            const changedFields = {};

            // Compare primitive fields
            if (title !== existing.title) changedFields.title = title;
            if (mCourse.shortname !== existing.shortname) changedFields.shortname = mCourse.shortname;
            // if (price !== existing.price) changedFields.price = price;

            const newSlug = `${mId}-${syncService.slugify(title)}`;
            if (newSlug !== existing.slug) changedFields.slug = newSlug;

            // Category: only if changed
            const existingCatId = existing.course_category?.documentId;
            if (catDocId !== existingCatId) changedFields.course_category = catDocId;

            // Languages: only add English if NO languages exist
            const hasLanguages = existing.languages && existing.languages.length > 0;
            if (!hasLanguages && EnglishLang) {
              changedFields.languages = [EnglishLang.documentId];
            }

            // Skip update if nothing changed
            if (Object.keys(changedFields).length === 0) {
              skipped++;
              continue;
            }

            // Only write changed fields
            log(`Updating [${mId}] ${title} — changed: ${Object.keys(changedFields).join(', ')}`);
            await strapi.documents('api::course.course').update({
              documentId: existing.documentId,
              data: changedFields
            });

            await strapi.documents('api::course.course').publish({
              documentId: existing.documentId,
            });
            updated++;
          }
        }

        // 4. Orphans
        let unpublished = 0;
        for (const [mId, sCourse] of strapiMap) {
          if (!seenMoodleIds.has(mId)) {
            await strapi.documents('api::course.course').unpublish({
              documentId: sCourse.documentId,
            });
            unpublished++;
          }
        }

        log(`Courses done — Created: ${created}, Updated: ${updated}, Skipped: ${skipped}, Unpublished: ${unpublished}`);
        return { created, updated, unpublished, skipped };

      } catch (error) {
        log(`Courses Error: ${error.message}`, 'error');
        throw error;
      }
    },

    decodeHtml(html) {
      if (!html) return '';
      return html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'");
    },

    slugify(text) {
      return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
    },

    convertToBlocks(text) {
      if (!text) return [];
      const plainText = text.replace(/<[^>]*>/g, '').trim();
      if (!plainText) return [];
      return [{ type: 'paragraph', children: [{ type: 'text', text: plainText }] }];
    },

    async getStats() {
      const courses = await strapi.documents('api::course.course').count();
      const categories = await strapi.documents('api::course-category.course-category').count();
      // Assuming cron job runs every 30s, we just return current time as last sync or fetch from a persistent store if implemented.
      // For now, let's return just counts.
      return {
        courses,
        categories,
        lastSync: lastSyncTime ? new Date(lastSyncTime).toISOString() : 'Never'
      };
    }
  };

  return syncService;
};
