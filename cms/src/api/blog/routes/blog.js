module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blogs',
      handler: 'blog.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/blogs/:id',
      handler: 'blog.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
