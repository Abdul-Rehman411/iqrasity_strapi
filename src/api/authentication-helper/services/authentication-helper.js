'use strict';

/**
 * authentication-helper service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::authentication-helper.authentication-helper');
