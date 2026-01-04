module.exports = {
  routes: [
    {
      method: "GET",
      path: "/authentication-helper/check-email",
      handler: "authentication-helper.checkEmail",
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Public access
      },
    },
  ],
};
