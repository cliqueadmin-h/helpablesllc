const { createHash, randomUUID } = require('node:crypto');
const { setTimeout: sleep } = require('node:timers/promises');
const { WorkflowFailure } = require('../workflow-failure');
const sendEmail = require('../resend');

const uid = 'api::workflow-execution.workflow-execution';
const alertWorkflow = 'workflow-alert';
const maximumAttempts = 3;
const leaseMs = 120_000;
const hourMs = 3_600_000;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

async function executeWithinTimeout(work, options, timeoutMs) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new WorkflowFailure('timeout'));
      controller.abort();
    }, timeoutMs);
  });

  try {
    const operation = Promise.resolve().then(() => work({ ...options, signal: controller.signal }));
    return await Promise.race([operation, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = ({ strapi }) => {
  const records = strapi.db.query(uid);

  function log(level, event, row, details = {}) {
    strapi.log[level](JSON.stringify({
      event,
      workflow: row.workflow,
      executionId: row.executionId,
      correlationId: row.correlationId,
      ...details,
    }));
  }

  function result(row, duplicate = false) {
    return { executionId: row.executionId, status: row.status, duplicate };
  }

  async function save(row, data) {
    const { count } = await records.updateMany({
      where: { id: row.id, leaseToken: row.leaseToken, status: 'running' },
      data,
    });
    if (count !== 1) {
      throw new Error('Workflow execution lease was lost');
    }
    Object.assign(row, data);
  }

  async function sendCriticalAlert(row) {
    const to = process.env.WORKFLOW_ALERT_EMAIL;
    const from = process.env.WORKFLOW_ALERT_FROM;
    if (!to || !from) {
      return;
    }

    const hour = Math.floor(Date.now() / hourMs);
    const key = `${row.workflow}:${row.errorCode}:${row.errorStatus}:${hour}`;
    try {
      await run({
        name: alertWorkflow,
        timeoutMs: 5000,
        idempotent: true,
        work: (options) => sendEmail({
          to,
          from,
          subject: `Helpables workflow failure: ${row.workflow}`,
          text: `Workflow: ${row.workflow}\nExecution: ${row.executionId}\nCorrelation: ${row.correlationId}\nFailure: ${row.errorCode}${row.errorStatus ? ` (${row.errorStatus})` : ''}`,
        }, options),
      }, key, { correlationId: row.correlationId });
    } catch {
      log('error', 'workflow.alert_unavailable', row);
    }
  }

  async function execute(spec, row) {
    const timeoutMs = Math.min(Math.max(spec.timeoutMs || 10_000, 1), 30_000);
    const attempts = spec.idempotent ? maximumAttempts : 1;
    log('info', 'workflow.started', row);

    for (let retry = 0; retry < attempts; retry++) {
      await save(row, { attempts: row.attempts + 1 });
      let failure;

      try {
        await executeWithinTimeout(spec.work, {
          correlationId: row.correlationId,
          executionId: row.executionId,
          idempotencyKey: row.dedupeKey,
          referenceId: row.referenceId,
        }, timeoutMs);
      } catch (error) {
        failure = error instanceof WorkflowFailure ? error : new WorkflowFailure('unexpected');
      }

      if (!failure) {
        await save(row, { status: 'succeeded', finishedAt: new Date(), errorCode: null, errorStatus: null });
        log('info', 'workflow.succeeded', row, { attempts: row.attempts });
        return result(row);
      }

      const error = { errorCode: failure.code, errorStatus: failure.status };
      if (failure.transient && retry + 1 < attempts) {
        const delay = 500 * (2 ** retry) + Math.floor(Math.random() * 250);
        log('warn', 'workflow.retrying', row, { ...error, attempts: row.attempts, delayMs: delay });
        await sleep(delay);
        continue;
      }

      await save(row, { ...error, status: 'failed', finishedAt: new Date() });
      log('error', 'workflow.failed', row, { ...error, attempts: row.attempts });
      if (spec.critical && row.workflow !== alertWorkflow) {
        await sendCriticalAlert(row);
      }
      return result(row);
    }
  }

  async function run(spec, key, { referenceId, correlationId } = {}) {
    if (!/^[a-z][a-z0-9-]{0,79}$/.test(spec.name) || typeof spec.work !== 'function'
      || typeof key !== 'string' || !key || key.length > 255
      || (referenceId != null && (!Number.isSafeInteger(referenceId) || referenceId < 1 || referenceId > 2_147_483_647))) {
      throw new Error('Invalid workflow execution settings');
    }

    const dedupeKey = createHash('sha256').update(`${spec.name}:${key}`).digest('hex');
    const executionId = randomUUID();
    let row;
    try {
      row = await records.create({ data: {
        workflow: spec.name,
        executionId,
        correlationId: uuid.test(correlationId ?? '') ? correlationId : randomUUID(),
        dedupeKey,
        referenceId,
        status: 'running',
        attempts: 0,
        startedAt: new Date(),
        leaseExpiresAt: new Date(Date.now() + leaseMs),
        leaseToken: randomUUID(),
      } });
    } catch (error) {
      const existing = await records.findOne({ where: { dedupeKey } });
      if (existing) {
        return result(existing, true);
      }
      throw error;
    }

    return execute(spec, row);
  }

  async function replay(spec, executionId) {
    if (!spec.idempotent || !spec.replayWindowMs || !uuid.test(executionId)) {
      throw new Error('Workflow execution is ineligible for replay');
    }

    const row = await records.findOne({ where: { workflow: spec.name, executionId } });
    const now = new Date();
    if (!row || row.referenceId == null || row.status === 'succeeded'
      || now.getTime() - new Date(row.startedAt).getTime() >= spec.replayWindowMs
      || (row.status === 'running' && new Date(row.leaseExpiresAt) > now)) {
      throw new Error('Workflow execution is ineligible for replay');
    }

    const data = {
      status: 'running',
      finishedAt: null,
      leaseToken: randomUUID(),
      leaseExpiresAt: new Date(now.getTime() + leaseMs),
    };
    const { count } = await records.updateMany({
      where: { id: row.id, status: row.status, leaseToken: row.leaseToken },
      data,
    });
    if (count !== 1) {
      throw new Error('Workflow execution was claimed concurrently');
    }

    log('info', 'workflow.replay', row, { attempts: row.attempts });
    return execute(spec, { ...row, ...data });
  }

  return { run, replay };
};
