module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/homepage',
      handler: 'homepage.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
