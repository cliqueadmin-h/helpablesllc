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
    {
      method: 'GET',
      path: '/homepage/:id',
      handler: 'homepage.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
