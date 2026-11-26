# Workflow operations

The Strapi workflow service records each execution in the existing application database. Authorized administrators can inspect the **Workflow Executions** collection in Content Manager and correlate records with the JSON events in Railway logs. The collection has no public API routes. A running record with an expired lease indicates execution was interrupted or the worker could not record its result.

Call `strapi.service('api::workflow-execution.workflow-execution').run(spec, key, options)` from an internal job. Give each workflow a fixed name and each business operation a stable, non-secret key. Supply an internal numeric record ID only when the handler needs it to reconstruct a replay. The runner stores a hash of the key and fixed error categories. It keeps payloads, provider response bodies, arbitrary error messages and stack traces out of the workflow records and logs.

The handler receives an abort signal, execution ID, correlation ID, reference ID and stable downstream idempotency key. Pass the signal to outbound requests. Enable automatic retry only when the provider or business operation honors the stable key across attempts. The runner makes up to three attempts with jittered exponential backoff for timeouts, network failures and transient upstream HTTP statuses. The same database key protects concurrent starts.

For critical failures, configure `WORKFLOW_ALERT_EMAIL` to an internal operations mailbox. The sender is `WORKFLOW_ALERT_FROM` when configured, otherwise the existing `SMTP_DEFAULT_FROM`. Use a sender verified with Resend. The runner uses the existing `RESEND_API_KEY`. Alerts carry execution metadata and are deduplicated in the database by workflow, error category, HTTP status and UTC hour. Check Railway logs for alert delivery failures.

When a handler supports safe replays, provide a `replayWindowMs` bounded by the downstream provider's idempotency retention. A privileged operator can call the registered handler's replay method from a server-side Strapi console using the execution ID. Replay accepts failed or expired executions within that window, claims the record atomically and preserves the downstream key. Confirm the original downstream result before handling an execution outside that window.

## Contact-form notifications

Contact submissions still persist before notification. The handler reads the existing submission, uses the same internal recipient and reply-to, and sends through Resend. It records each delivery operation once. A successful delivery remains protected against repeats even after the provider's idempotency window ends.

Use `npm run strapi -- console` in an authorized backend shell. For a failed contact notification, review its execution record and run `await strapi.service('api::contact-submission.workflow-notification').replay('<execution-id>')`. The handler uses a 23-hour replay window. Leave older executions for manual reconciliation against Resend delivery history.
