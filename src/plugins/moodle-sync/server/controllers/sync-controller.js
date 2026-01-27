'use strict';

module.exports = ({ strapi }) => ({
  async syncCategories(ctx) {
    try {
      const result = await strapi.plugin('moodle-sync').service('syncService').syncCategories();
      ctx.body = { message: 'Categories sync completed', result };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async syncCourses(ctx) {
    try {
      const result = await strapi.plugin('moodle-sync').service('syncService').syncCourses();
      ctx.body = { message: 'Courses sync completed', result };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async getStats(ctx) {
    try {
      const stats = await strapi.plugin('moodle-sync').service('syncService').getStats();
      ctx.body = stats;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async syncAll(ctx) {
    try {
      const result = await strapi.plugin('moodle-sync').service('syncService').syncAll();
      ctx.body = { message: 'Full sync completed', result };
    } catch (error) {
      if (error.message.includes('already running')) {
         return ctx.locked(error.message); // Return 423 Locked
      }
      ctx.throw(500, error.message);
    }
  },

  async getSettings(ctx) {
    try {
      const settings = await strapi.plugin('moodle-sync').service('syncService').getSettings();
      ctx.body = settings;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async updateSettings(ctx) {
    try {
      const settings = await strapi.plugin('moodle-sync').service('syncService').updateSettings(ctx.request.body);
      ctx.body = settings;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
});
