module.exports = {
  afterCreate({ result }) {
    // The submission is stored independently of its internal email notification.
    setImmediate(async () => {
      try {
        const notification = strapi.service('api::contact-submission.workflow-notification');
        await notification.notify(result.id);
      } catch {
        strapi.log.error(JSON.stringify({
          event: 'workflow.start_failed',
          workflow: 'contact-submission-notification',
        }));
      }
    });
  },
};
