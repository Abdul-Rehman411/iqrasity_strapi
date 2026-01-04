'use strict';

/**
 * authentication-helper controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::authentication-helper.authentication-helper', ({ strapi }) => ({
  async checkEmail(ctx) {
    const { email } = ctx.query;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    try {
      // Find user by email in the users-permissions plugin
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: email },
        select: ['id', 'provider', 'username'], // Only select necessary fields
      });

      if (user) {
        return ctx.send({
          exists: true,
          provider: user.provider,
          username: user.username, // Helpful for "Welcome back, [Name]"
        });
      } else {
        return ctx.send({
          exists: false,
        });
      }
    } catch (error) {
      strapi.log.error('Check email error:', error);
      return ctx.internalServerError('Failed to check email');
    }
  },
}));
