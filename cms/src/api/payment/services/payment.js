'use strict';

/**
 * Payment service
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = () => ({
  /**
   * Retrieve a payment intent from Stripe
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  },

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      console.error('Error canceling payment intent:', error);
      throw error;
    }
  },

  /**
   * Create a refund for a payment
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount);
      }

      return await stripe.refunds.create(refundData);
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  },

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email) {
    try {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId) {
    try {
      return await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  /**
   * Send payment confirmation email (stub - implement with your email service)
   */
  async sendPaymentConfirmation(order) {
    // TODO: Implement email sending logic
    // You can use Strapi's email plugin or a third-party service
    console.log(`Payment confirmation email should be sent for order ${order.id}`);
    
    // Example with Strapi email plugin:
    // await strapi.plugins['email'].services.email.send({
    //   to: order.customerEmail,
    //   from: 'noreply@helpables.io',
    //   subject: 'Payment Confirmation',
    //   text: `Your payment of ${order.amount / 100} ${order.currency.toUpperCase()} has been confirmed.`,
    //   html: `<p>Your payment of <strong>${order.amount / 100} ${order.currency.toUpperCase()}</strong> has been confirmed.</p>`,
    // });
  },

  /**
   * Send payment failed notification (stub)
   */
  async sendPaymentFailedNotification(order) {
    console.log(`Payment failed notification should be sent for order ${order.id}`);
    
    // TODO: Implement notification logic
  },

  /**
   * Calculate service fee or tax (stub)
   */
  calculateTotal(amount, currency = 'usd') {
    // TODO: Add any service fees, taxes, or discounts
    // For now, just return the amount as-is
    return Math.round(amount);
  },

  /**
   * Validate payment amount based on service
   */
  validateAmount(service, amount) {
    // TODO: Add service-specific validation
    // For example, minimum amounts, fixed prices, etc.
    
    if (amount < 50) { // Minimum $0.50
      throw new Error('Amount must be at least $0.50');
    }

    return true;
  },

  /**
   * Get order statistics
   */
  async getOrderStats(filters = {}) {
    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters,
      });

      const stats = {
        total: orders.length,
        succeeded: orders.filter(o => o.status === 'succeeded').length,
        pending: orders.filter(o => o.status === 'pending').length,
        failed: orders.filter(o => o.status === 'failed').length,
        refunded: orders.filter(o => o.status === 'refunded').length,
        totalRevenue: orders
          .filter(o => o.status === 'succeeded')
          .reduce((sum, o) => sum + o.amount, 0),
      };

      return stats;
    } catch (error) {
      console.error('Error calculating order stats:', error);
      throw error;
    }
  },
});
