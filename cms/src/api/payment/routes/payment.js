module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/create-intent',
      handler: 'payment.createPaymentIntent',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/payment/webhook',
      handler: 'payment.webhook',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/payment/order/:id',
      handler: 'payment.getOrder',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/payment/confirm',
      handler: 'payment.confirmPayment',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};
