'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'POST',
        path: '/sync/categories',
        handler: 'syncController.syncCategories',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/sync/courses',
        handler: 'syncController.syncCourses',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/stats',
        handler: 'syncController.getStats',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/sync/all',
        handler: 'syncController.syncAll',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/settings',
        handler: 'syncController.getSettings',
        config: {
          policies: [],
        },
      },
      {
        method: 'PUT',
        path: '/settings',
        handler: 'syncController.updateSettings',
        config: {
          policies: [],
        },
      },
    ],
  },
};
