module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Send email using Resend API directly (non-blocking)
    setImmediate(async () => {
      try {
        const fetch = require('node-fetch');
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.SMTP_DEFAULT_FROM || 'onboarding@resend.dev',
            to: 'cliqueadmin@helpables.org',
            reply_to: result.email,
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
          }),
        });

        if (response.ok) {
          const data = await response.json();
          strapi.log.info(`✅ Contact form notification sent for submission #${result.id} (Email ID: ${data.id})`);
        } else {
          const error = await response.text();
          strapi.log.error(`❌ Failed to send email for #${result.id}:`, error);
        }
      } catch (error) {
        strapi.log.error(`❌ Failed to send contact form notification for #${result.id}:`, error.message);
      }
    });
  },
};
