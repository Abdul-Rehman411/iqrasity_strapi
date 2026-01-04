module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/legal-pages',
      handler: 'legal-page.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/legal-pages/:id',
      handler: 'legal-page.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
