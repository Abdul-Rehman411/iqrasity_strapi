export default {
  routes: [
    {
      method: 'GET',
      path: '/logo',
      handler: 'logo.find',
      config: {
        auth: false
      }
    }
  ]
};
