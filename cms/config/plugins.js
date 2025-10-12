module.exports = ({ env }) => ({
  // Configure the users-permissions plugin
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  
  // Email configuration
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM', 'noreply@helpables.org'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLYTO', 'cliqueadmin@helpables.org'),
      },
    },
  },
});
