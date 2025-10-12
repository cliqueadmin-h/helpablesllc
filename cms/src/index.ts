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
    // Set permissions for public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      console.warn('Public role not found');
      return;
    }

    // Content types to enable public access
    const contentTypes = ['blog', 'service', 'testimonial', 'homepage', 'faq'];
    
    for (const contentType of contentTypes) {
      // Enable find and findOne permissions
      await strapi.query('plugin::users-permissions.permission').updateMany({
        where: {
          role: publicRole.id,
          action: `api::${contentType}.${contentType}.find`,
        },
        data: { enabled: true },
      });

      await strapi.query('plugin::users-permissions.permission').updateMany({
        where: {
          role: publicRole.id,
          action: `api::${contentType}.${contentType}.findOne`,
        },
        data: { enabled: true },
      });

      console.log(`✅ Enabled public access for ${contentType}`);
    }

    console.log('✅ Public permissions configured successfully');
  },
};
