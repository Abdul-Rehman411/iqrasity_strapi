'use strict';

module.exports = ({ strapi }) => {
  strapi.log.info('MoodleSync: Initializing Plugin Bootstrap');

  // Register cron task
  // Note: We use a standard setInterval for simplicity within the plugin 
  // or use official Strapi Cron if enabled.
  // For a 30s interval, a simplified approach is fine.
  
  // Initialize Auto-Sync logic (Timer management)
  setTimeout(async () => {
    try {
      await strapi.plugin('moodle-sync').service('syncService').initAutoSync();
    } catch (err) {
      strapi.log.error(`MoodleSync Bootstrap Error: ${err.message}`);
    }
  }, 5000);
};
