'use strict';

/**
 * Payment controller
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  /**
   * Create a payment intent
   * POST /api/payment/create-intent
   */
  async createPaymentIntent(ctx) {
    try {
      const { amount, currency = 'usd', service, customerEmail, customerName, customerPhone, metadata } = ctx.request.body;

      // Validate required fields
      if (!amount || !service || !customerEmail) {
        return ctx.badRequest('Missing required fields: amount, service, customerEmail');
      }

      // Validate amount is positive
      if (amount <= 0) {
        return ctx.badRequest('Amount must be greater than 0');
      }

      // Create Stripe customer if email provided
      let stripeCustomerId = null;
      if (customerEmail) {
        const existingCustomers = await stripe.customers.list({
          email: customerEmail,
          limit: 1
        });

        if (existingCustomers.data.length > 0) {
          stripeCustomerId = existingCustomers.data[0].id;
        } else {
          const customer = await stripe.customers.create({
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            metadata: metadata || {}
          });
          stripeCustomerId = customer.id;
        }
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Stripe expects amount in cents
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        metadata: {
          service,
          customerEmail,
          customerName: customerName || '',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create order record in Strapi
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          amount: Math.round(amount),
          currency: currency.toLowerCase(),
          service,
          customerEmail,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          paymentIntentId: paymentIntent.id,
          stripeCustomerId,
          status: 'pending',
          metadata: metadata || null,
        },
      });

      ctx.send({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id,
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
      });

    } catch (error) {
      console.error('Error creating payment intent:', error);
      ctx.throw(500, `Failed to create payment intent: ${error.message}`);
    }
  },

  /**
   * Handle Stripe webhooks
   * POST /api/payment/webhook
   */
  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        ctx.request.body[Symbol.for('unparsedBody')],
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return ctx.badRequest(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;

        case 'payment_intent.canceled':
          await handlePaymentCanceled(event.data.object);
          break;

        case 'charge.refunded':
          await handleRefund(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      ctx.send({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      ctx.throw(500, `Webhook handler failed: ${error.message}`);
    }
  },

  /**
   * Get order details
   * GET /api/payment/order/:id
   */
  async getOrder(ctx) {
    try {
      const { id } = ctx.params;

      const order = await strapi.entityService.findOne('api::order.order', id);

      if (!order) {
        return ctx.notFound('Order not found');
      }

      ctx.send({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          service: order.service,
          status: order.status,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          receiptUrl: order.receiptUrl,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      ctx.throw(500, `Failed to fetch order: ${error.message}`);
    }
  },

  /**
   * Confirm payment (optional - for manual confirmation flow)
   * POST /api/payment/confirm
   */
  async confirmPayment(ctx) {
    try {
      const { paymentIntentId } = ctx.request.body;

      if (!paymentIntentId) {
        return ctx.badRequest('Missing paymentIntentId');
      }

      // Confirm the payment intent
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

      ctx.send({
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      ctx.throw(500, `Failed to confirm payment: ${error.message}`);
    }
  },
};

/**
 * Helper functions for webhook handlers
 */

async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // Find the order by payment intent ID
  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: { paymentIntentId: paymentIntent.id },
    limit: 1,
  });

  if (orders.length > 0) {
    const order = orders[0];

    // Update order status
    await strapi.entityService.update('api::order.order', order.id, {
      data: {
        status: 'succeeded',
        paymentMethod: paymentIntent.payment_method,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null,
      },
    });

    console.log(`Order ${order.id} marked as succeeded`);

    // Here you can add additional logic:
    // - Send confirmation email
    // - Trigger fulfillment process
    // - Update inventory
    // - Send notification to admin
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: { paymentIntentId: paymentIntent.id },
    limit: 1,
  });

  if (orders.length > 0) {
    const order = orders[0];

    await strapi.entityService.update('api::order.order', order.id, {
      data: {
        status: 'failed',
        errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });

    console.log(`Order ${order.id} marked as failed`);
  }
}

async function handlePaymentCanceled(paymentIntent) {
  console.log('Payment canceled:', paymentIntent.id);

  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: { paymentIntentId: paymentIntent.id },
    limit: 1,
  });

  if (orders.length > 0) {
    const order = orders[0];

    await strapi.entityService.update('api::order.order', order.id, {
      data: {
        status: 'canceled',
      },
    });

    console.log(`Order ${order.id} marked as canceled`);
  }
}

async function handleRefund(charge) {
  console.log('Charge refunded:', charge.id);

  const paymentIntentId = charge.payment_intent;

  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: { paymentIntentId },
    limit: 1,
  });

  if (orders.length > 0) {
    const order = orders[0];

    await strapi.entityService.update('api::order.order', order.id, {
      data: {
        status: 'refunded',
      },
    });

    console.log(`Order ${order.id} marked as refunded`);
  }
}
