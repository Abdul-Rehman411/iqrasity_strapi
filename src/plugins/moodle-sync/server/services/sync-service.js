'use strict';

const CUSTOM_API_URL = 'https://iqrasity.org/iq_api.php';
const CUSTOM_API_TOKEN = 'iqSyncSec2026Next';
const MOODLE_URL = 'https://iqrasity.org';
const MOODLE_TOKEN = 'bfa54fc57e132203b185b9783a958076';

module.exports = ({ strapi }) => {
  let isSyncing = false;
  let autoSyncTimer = null;
  let lastSyncTime = 0;

  const log = (msg, type = 'info') => strapi.log[type](`[MoodleSync] ${msg}`);
  
  const formatInterval = (ms) => {
    if (ms >= 86400000) return `${ms / 86400000}h`;
    if (ms >= 3600000) return `${ms / 3600000}h`;
    if (ms >= 60000) return `${ms / 60000}m`;
    return `${ms / 1000}s`;
  };

  const syncService = {
    async initAutoSync() {
      const settings = await syncService.getSettings();
      if (settings.enabled) {
        syncService.startAutoSync(settings.interval);
      }
    },

    startAutoSync(interval) {
      if (autoSyncTimer) clearInterval(autoSyncTimer);
      
      const intervalMs = Math.max(10000, interval); // Min 10s
      log(`Auto-sync scheduled (Interval: ${intervalMs}ms)`);

      autoSyncTimer = setInterval(async () => {
         // SAFETY DOUBLE-CHECK: Fetch settings again to ensure we are still enabled
         // This prevents "Zombie" syncs if the timer wasn't cleared properly
         const currentSettings = await syncService.getSettings();
         if (!currentSettings.enabled) {
             log('Auto-sync disabled. Stopping timer.', 'warn');
             clearInterval(autoSyncTimer);
             autoSyncTimer = null;
             return;
         }

         // RATE LIMITING
         const now = Date.now();
         if (now - lastSyncTime < 15000) {
             log('Skipping sync: Rate limit cooldown (15s).', 'warn');
             return;
         }

         try {
            log('Automated Sync Triggered', 'info');
            // Check if already syncing
            if (isSyncing) {
                log('Skipping sync: Another sync process is active.', 'warn');
                return;
            }

            await syncService.syncCategories();
            await syncService.syncCourses({ isManual: false });
            lastSyncTime = Date.now();
            log('Automated Sync Completed Successfully.');
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
        environment: '',
        type: 'plugin',
        name: 'moodle-sync',
        key: 'settings',
      });

      const settings = await pluginStore.get();
      // Default settings
      return settings || { enabled: false, interval: 30000 };
    },

    async updateSettings(newSettings) {
      // Debug: Log what we received
      log(`Settings update received: ${JSON.stringify(newSettings)}`, 'debug');
      
      const pluginStore = strapi.store({
        environment: '',
        type: 'plugin',
        name: 'moodle-sync',
        key: 'settings',
      });

      const prevSettings = await syncService.getSettings();
      const settings = { ...prevSettings, ...newSettings };
      
      await pluginStore.set({ value: settings });

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
        throw new Error('A synchronization process is already running.');
      }
      
      try {
        isSyncing = true;
        const categoriesResult = await syncService.syncCategories();
        // Manual sync triggers full update including enrolled_count
        const coursesResult = await syncService.syncCourses({ isManual: true });
        
        return {
          categories: categoriesResult,
          courses: coursesResult
        };
      } finally {
        isSyncing = false;
      }
    },

    async syncCategories() {
      strapi.log.info('MoodleSync: Starting Categories Synchronization');
      
      try {
        // 1. Fetch from Moodle
        const params = new URLSearchParams({
          wstoken: MOODLE_TOKEN,
          wsfunction: 'core_course_get_categories',
          moodlewsrestformat: 'json'
        });

        const response = await fetch(`${MOODLE_URL}/webservice/rest/server.php?${params}`);
        const categories = await response.json();

        if (categories.exception) {
          throw new Error(`Moodle API Error: ${categories.message}`);
        }

        const visibleCategories = categories.filter(c => c.visible === 1);
        strapi.log.info(`MoodleSync: Found ${visibleCategories.length} visible categories.`);

        // 2. Fetch Existing from Strapi
        const strapiCategories = await strapi.documents('api::course-category.course-category').findMany({
          fields: ['moodle_id', 'name', 'description', 'slug'],
        });
        
        strapi.log.info(`MoodleSync: Fetched ${strapiCategories.length} existing categories.`);

        const strapiMap = new Map();
        strapiCategories.forEach(c => {
          if (c.moodle_id) strapiMap.set(String(c.moodle_id), c);
        });

        const processedMoodleIds = new Set();
        let created = 0, updated = 0;

        // 3. Sync Loop
        for (const cat of visibleCategories) {
          const mId = String(cat.id);
          processedMoodleIds.add(mId);
          const existing = strapiMap.get(mId);

          const name = syncService.decodeHtml(cat.name);
          const description = syncService.convertToBlocks(cat.description);

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
            const hasChanged = existing.name !== name || 
                               JSON.stringify(existing.description) !== JSON.stringify(description) ||
                               existing.slug !== syncService.slugify(name);

            if (hasChanged) {
              await strapi.documents('api::course-category.course-category').update({
                documentId: existing.documentId,
                data: {
                  name,
                  description,
                  slug: syncService.slugify(name),
                }
              });
              
              // Ensure it is published if we updated it
              await strapi.documents('api::course-category.course-category').publish({
                documentId: existing.documentId,
              });
              updated++;
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

        return { created, updated, unpublished };

      } catch (error) {
        strapi.log.error(`MoodleSync Categories Error: ${error.message}`);
        throw error;
      }
    },

    async syncCourses({ isManual = false } = {}) {
      strapi.log.info(`MoodleSync: Starting Courses Synchronization (Manual: ${isManual})`);

      try {
        // 1. Fetch from Moodle
        const response = await fetch(`${CUSTOM_API_URL}?action=courses`, {
          headers: { 'X-IQ-TOKEN': CUSTOM_API_TOKEN }
        });
        const json = await response.json();
        
        if (json.status !== 'success') throw new Error(json.message);
        const moodleCourses = json.data || [];
        strapi.log.info(`MoodleSync: Found ${moodleCourses.length} courses from Moodle.`);

        // 2. Fetch Data dependencies
        const strapiCourses = await strapi.documents('api::course.course').findMany({
          fields: [
            'moodle_course_id', 
            'title', 
            'shortname', 
            'short_description', 
            'price', 
            'currency', 
            'total_duration_hours', 
            'level', 
            'slug',
            'enrolled_count'
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
            strapi.log.warn(`MoodleSync: Skipping ${title} - Category ${mCourse.category_id} not found.`);
            skipped++;
            continue;
          }

          const price = mCourse.price === 'FREE' ? 0 : parseFloat(mCourse.price) || 0;
          const short_description = (mCourse.summary || `Learn ${title}`).substring(0, 300);

          const payload = {
            title,
            shortname: mCourse.shortname,
            moodle_course_id: mId,
            course_category: catDocId,
            short_description,
            enrolled_count: String(mCourse.enrolled_students || 0),
            price,
            currency: mCourse.currency_symbol || '$',
            total_duration_hours: parseInt(mCourse.duration_hours) || null,
            level: (mCourse.level || 'beginner').toLowerCase(),
            languages: EnglishLang ? [EnglishLang.documentId] : [],
          };

          if (!existing) {
            payload.slug = `${mId}-${syncService.slugify(title)}`;
            await strapi.documents('api::course.course').create({ 
              data: payload,
              status: 'published'
            });
            created++;
          } else {
            // CHANGE DETECTION & SAFE MERGE
            
            // 1. Language Safety: Only add English if NO languages exist
            const hasLanguages = existing.languages && existing.languages.length > 0;
            if (hasLanguages) {
               delete payload.languages;
            }

            // 2. Manual Update Overrides
            if (!isManual && payload.enrolled_count) {
               delete payload.enrolled_count;
            }

            // 3. Category Safety: Only update if changed
            const existingCatId = existing.course_category?.documentId;
            if (existingCatId === catDocId) {
               delete payload.course_category;
            }

            // 4. Comparison
            payload.slug = `${mId}-${syncService.slugify(title)}`;
            
            const fieldsToCompare = [
              'title', 'shortname', 'short_description', 'price', 
              'currency', 'total_duration_hours', 'level', 'slug', 'enrolled_count'
            ];

            let hasChanged = false;
            for (const field of fieldsToCompare) {
               if (payload.hasOwnProperty(field)) {
                  // Shallow comparison is sufficient for these primitive fields
                  if (String(payload[field]) !== String(existing[field] || '')) {
                     hasChanged = true;
                     break;
                  }
               }
            }

            // Also check relations if they were not deleted from payload
            if (payload.course_category || payload.languages) {
               hasChanged = true;
            }

            if (hasChanged) {
              await strapi.documents('api::course.course').update({
                documentId: existing.documentId,
                data: payload
              });

              await strapi.documents('api::course.course').publish({
                documentId: existing.documentId,
              });
              updated++;
            }
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

        return { created, updated, unpublished, skipped };

      } catch (error) {
        strapi.log.error(`MoodleSync Courses Error: ${error.message}`);
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

  // Hook into syncAll to update time
  const originalSyncAll = syncService.syncAll;
  syncService.syncAll = async function() {
      const result = await originalSyncAll.apply(this);
      lastSyncTime = Date.now();
      return result;
  };

  return syncService;
};
