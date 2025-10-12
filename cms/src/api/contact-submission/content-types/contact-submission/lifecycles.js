module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Send email in background (non-blocking) with timeout
    setImmediate(async () => {
      try {
        // Add a timeout to prevent hanging
        const emailPromise = strapi.plugins['email'].services.email.send({
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

        // Race between email send and 10 second timeout
        await Promise.race([
          emailPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email timeout after 10s')), 10000)
          )
        ]);

        strapi.log.info(`✅ Contact form notification sent for submission #${result.id}`);
      } catch (error) {
        strapi.log.error(`❌ Failed to send contact form notification for #${result.id}:`, error.message);
        strapi.log.error('Check SMTP settings:', {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USERNAME,
          from: process.env.SMTP_DEFAULT_FROM
        });
      }
    });
  },
};
