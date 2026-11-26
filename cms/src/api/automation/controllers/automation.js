module.exports = {
  triggerSignup(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to acknowledge signup');
    }

    // Existing mobile versions call this route after successful authentication.
    return ctx.send({
      success: true,
      message: 'Signup acknowledged',
      data: {
        userId: user.id,
        triggeredAt: new Date().toISOString(),
        workflowStatus: { status: 'retired' },
      },
    });
  },

  triggerWorkflow(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated to trigger workflows');
    }

    if (!ctx.request.body?.workflowName) {
      return ctx.badRequest('workflowName is required');
    }

    ctx.status = 410;
    ctx.body = {
      success: false,
      message: 'The automation workflow endpoint has been retired',
    };
  },
};
