module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // Send email notification to admin
      await strapi.plugins['email'].services.email.send({
        to: 'cliqueadmin@helpables.org',
        from: process.env.SMTP_DEFAULT_FROM || 'noreply@helpables.org',
        replyTo: result.email,
        subject: `New Contact Form Submission: ${result.subject || 'No Subject'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${result.name}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          ${result.phone ? `<p><strong>Phone:</strong> ${result.phone}</p>` : ''}
          ${result.subject ? `<p><strong>Subject:</strong> ${result.subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${result.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date(result.createdAt).toLocaleString()}</small></p>
        `,
      });

      strapi.log.info(`Contact form notification sent for submission #${result.id}`);
    } catch (error) {
      strapi.log.error('Failed to send contact form notification:', error);
    }
  },
};
