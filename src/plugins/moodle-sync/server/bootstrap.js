'use strict';

module.exports = ({ strapi }) => {
  strapi.log.info('[🔄 MOODLE-SYNC] Initializing Plugin Bootstrap');

  // Register cron task
  // Note: We use a standard setInterval for simplicity within the plugin 
  // or use official Strapi Cron if enabled.
  // For a 30s interval, a simplified approach is fine.
  
  // Initialize Auto-Sync logic (Timer management)
  setTimeout(async () => {
    try {
      // Prevent running during transfer/export/import commands
      // These commands often lock the DB or use all connections
      const isTransfer = process.argv.some(arg => arg.includes('transfer') || arg.includes('import') || arg.includes('export'));
      if (isTransfer) {
        strapi.log.info('[🔄 MOODLE-SYNC] Skipping auto-sync (Transfer/Import detected)');
        return;
      }

      strapi.log.info('[🔄 MOODLE-SYNC] Bootstrap timer finished. Calling initAutoSync()...');
      await strapi.plugin('moodle-sync').service('syncService').initAutoSync();
    } catch (err) {
      strapi.log.error(`[🔄 MOODLE-SYNC] Bootstrap Error: ${err.message}`);
    }
  }, 15000);
};
