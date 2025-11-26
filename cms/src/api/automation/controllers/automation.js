'use strict';

/**
 * Automation controller
 */

module.exports = {
  /**
   * Trigger signup automation workflow in n8n
   * POST /api/automation/trigger-signup
   */
  async triggerSignup(ctx) {
    try {
      // Verify user is authenticated (automatically checked by route policy)
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('You must be authenticated to trigger this automation');
      }

      // Get request body
      const requestData = ctx.request.body;

      // Validate n8n configuration
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      const n8nApiKey = process.env.N8N_API_KEY;

      if (!n8nWebhookUrl || !n8nApiKey) {
        strapi.log.error('N8N configuration missing in environment variables');
        return ctx.internalServerError('Automation service is not properly configured');
      }

      // Prepare payload for n8n
      const n8nPayload = {
        userId: user.id,
        userEmail: user.email,
        username: user.username,
        timestamp: new Date().toISOString(),
        ...requestData, // Include any additional data from the request
      };

      // Call n8n webhook using fetch
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': n8nApiKey,
        },
        body: JSON.stringify(n8nPayload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Check if request was successful
      if (!response.ok) {
        const errorText = await response.text();
        strapi.log.error('N8N webhook error:', errorText);
        return ctx.badRequest('Failed to trigger automation workflow', {
          status: response.status,
          details: errorText,
        });
      }

      // Parse response
      const n8nResponse = await response.json();

      // Log success
      strapi.log.info(`Signup automation triggered successfully for user ${user.id}`);

      // Return success response
      ctx.send({
        success: true,
        message: 'Automation triggered successfully',
        data: {
          userId: user.id,
          triggeredAt: new Date().toISOString(),
          workflowStatus: n8nResponse,
        },
      });

    } catch (error) {
      // Handle fetch errors
      if (error.name === 'AbortError') {
        strapi.log.error('N8N webhook timeout');
        return ctx.internalServerError('Automation service timed out');
      }
      
      strapi.log.error('Automation trigger error:', error.message);
      return ctx.internalServerError('An error occurred while triggering automation', {
        error: error.message,
      });
    }
  },

  /**
   * Trigger general automation workflow
   * POST /api/automation/trigger
   */
  async triggerWorkflow(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('You must be authenticated to trigger workflows');
      }

      const { workflowName, workflowData } = ctx.request.body;

      if (!workflowName) {
        return ctx.badRequest('workflowName is required');
      }

      // Get n8n configuration
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      const n8nApiKey = process.env.N8N_API_KEY;

      if (!n8nWebhookUrl || !n8nApiKey) {
        strapi.log.error('N8N configuration missing in environment variables');
        return ctx.internalServerError('Automation service is not properly configured');
      }

      // Prepare payload
      const n8nPayload = {
        workflow: workflowName,
        userId: user.id,
        userEmail: user.email,
        username: user.username,
        timestamp: new Date().toISOString(),
        data: workflowData || {},
      };

      // Call n8n webhook using fetch
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': n8nApiKey,
        },
        body: JSON.stringify(n8nPayload),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        strapi.log.error('N8N webhook error:', errorText);
        return ctx.badRequest('Failed to trigger workflow', {
          status: response.status,
          details: errorText,
        });
      }

      const n8nResponse = await response.json();

      strapi.log.info(`Workflow "${workflowName}" triggered successfully for user ${user.id}`);

      ctx.send({
        success: true,
        message: 'Workflow triggered successfully',
        data: {
          workflow: workflowName,
          userId: user.id,
          triggeredAt: new Date().toISOString(),
          workflowStatus: n8nResponse,
        },
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        strapi.log.error('N8N webhook timeout');
        return ctx.internalServerError('Automation service timed out');
      }
      
      strapi.log.error('Workflow trigger error:', error.message);
      return ctx.internalServerError('An error occurred while triggering workflow', {
        error: error.message,
      });
    }
  },
};
