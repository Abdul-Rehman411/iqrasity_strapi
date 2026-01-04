'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/about-page',
      handler: 'about-page.find',
      config: {
        auth: false,
      },
    }
  ],
};
