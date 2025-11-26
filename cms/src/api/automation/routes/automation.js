module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/automation/trigger-signup',
      handler: 'automation.triggerSignup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/automation/trigger',
      handler: 'automation.triggerWorkflow',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
