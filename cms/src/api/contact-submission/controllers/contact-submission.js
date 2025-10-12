'use strict';

/**
 * contact-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  // Add custom test-email endpoint
  async testEmail(ctx) {
    try {
      console.log('🧪 Testing email configuration...');
      
      await strapi.plugins['email'].services.email.send({
        to: 'cliqueadmin@helpables.org',
        from: process.env.SMTP_DEFAULT_FROM || 'noreply@helpables.org',
        replyTo: process.env.SMTP_DEFAULT_REPLYTO || 'noreply@helpables.org',
        subject: 'Test Email from Helpables Contact Form',
        html: `
          <h2>🧪 Email Test</h2>
          <p>This is a test email to verify the email configuration is working.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <hr>
          <p>If you received this email, the email configuration is working correctly!</p>
        `,
      });

      console.log('✅ Test email sent successfully');
      
      ctx.body = {
        success: true,
        message: 'Test email sent successfully to cliqueadmin@helpables.org'
      };
    } catch (error) {
      console.error('❌ Test email failed:', error);
      
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: error.message,
        details: error.toString()
      };
    }
  },
}));
