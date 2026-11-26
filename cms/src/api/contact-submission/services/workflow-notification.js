const sendEmail = require('../../workflow-execution/resend');
const { WorkflowFailure } = require('../../workflow-execution/workflow-failure');

const submissionUid = 'api::contact-submission.contact-submission';
const runnerUid = 'api::workflow-execution.workflow-execution';
const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => escapes[character]);
}

module.exports = ({ strapi }) => {
  const spec = {
    name: 'contact-submission-notification',
    idempotent: true,
    critical: true,
    // Keep replay safely inside Resend's 24-hour key retention.
    replayWindowMs: 23 * 60 * 60 * 1000,
    async work(options) {
      const submission = await strapi.db.query(submissionUid).findOne({
        where: { id: options.referenceId },
      });
      if (!submission) {
        throw new WorkflowFailure('missing-record');
      }

      await sendEmail({
        from: process.env.SMTP_DEFAULT_FROM || 'onboarding@resend.dev',
        to: 'cliqueadmin@helpables.org',
        reply_to: submission.email,
        subject: `New Contact Form Submission: ${submission.subject || 'No Subject'}`,
        html: [
          '<h2>New Contact Form Submission</h2>',
          `<p><strong>From:</strong> ${escapeHtml(submission.name)}</p>`,
          `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>`,
          submission.phone ? `<p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>` : '',
          `<p><strong>Subject:</strong> ${escapeHtml(submission.subject || 'No Subject')}</p>`,
          `<p><strong>Message:</strong></p><p>${escapeHtml(submission.message).replace(/\r?\n/g, '<br>')}</p>`,
          `<hr><p><small>Submitted at: ${new Date(submission.createdAt).toLocaleString()}</small></p>`,
        ].join('\n'),
      }, options);
    },
  };

  return {
    notify(referenceId) {
      return strapi.service(runnerUid).run(spec, String(referenceId), { referenceId });
    },
    replay(executionId) {
      return strapi.service(runnerUid).replay(spec, executionId);
    },
  };
};
