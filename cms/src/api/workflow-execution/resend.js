const { WorkflowFailure } = require('./workflow-failure');

module.exports = async function sendEmail(message, { signal, idempotencyKey }) {
  if (!process.env.RESEND_API_KEY) {
    throw new WorkflowFailure('configuration');
  }

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(message),
    });
  } catch {
    throw new WorkflowFailure('network');
  }

  await response.body?.cancel().catch(() => {});
  if (!response.ok) {
    throw new WorkflowFailure('upstream-http', response.status);
  }
};
