export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    console.log('🔧 Starting bootstrap to configure public permissions...');
    
    try {
      // Get the public role
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.error('❌ Public role not found');
        return;
      }

      console.log(`✅ Found public role with ID: ${publicRole.id}`);

      // Content types to enable public access
      const contentTypes = ['blog', 'service', 'testimonial', 'homepage', 'faq'];
      
      for (const contentType of contentTypes) {
        const actions = ['find', 'findOne'];
        
        for (const action of actions) {
          const permissionName = `api::${contentType}.${contentType}.${action}`;
          
          // Find existing permission
          const existingPermission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                role: publicRole.id,
                action: permissionName,
              },
            });

          if (existingPermission) {
            // Update existing permission
            await strapi
              .query('plugin::users-permissions.permission')
              .update({
                where: { id: existingPermission.id },
                data: { enabled: true },
              });
            console.log(`✅ Enabled ${permissionName}`);
          } else {
            // Create new permission if it doesn't exist
            await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action: permissionName,
                  role: publicRole.id,
                  enabled: true,
                },
              });
            console.log(`✅ Created and enabled ${permissionName}`);
          }
        }
      }

      console.log('🎉 Public permissions configured successfully!');
      
      // Seed sample data if in production and no content exists
      if (process.env.NODE_ENV === 'production') {
        const seed = require('./seed');
        await seed({ strapi });
      }
    } catch (error) {
      console.error('❌ Error configuring public permissions:', error);
    }
  },
};
