module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/about-page',
      handler: 'about-page.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/about-page',
      handler: 'about-page.update',
    },
    {
      method: 'DELETE',
      path: '/about-page',
      handler: 'about-page.delete',
    },
  ],
};
