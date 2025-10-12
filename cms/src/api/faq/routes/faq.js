module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/faqs',
      handler: 'faq.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/faqs/:id',
      handler: 'faq.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
