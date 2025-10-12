/**
 * Seed script to create sample content for testing
 * Run this from the CMS admin or via Strapi console
 */

module.exports = async ({ strapi }: { strapi: any }) => {
  console.log('🌱 Starting database seeding...');

  try {
    // Create homepage content
    const existingHomepage = await strapi.entityService.findMany('api::homepage.homepage');
    
    if (!existingHomepage || existingHomepage.length === 0) {
      await strapi.entityService.create('api::homepage.homepage', {
        data: {
          title: 'Welcome to Helpables LLC',
          subtitle: 'Professional Business Services',
          heroDescription: 'We provide comprehensive business solutions to help your company grow and succeed.',
          publishedAt: new Date(),
        },
      });
      console.log('✅ Created homepage');
    }

    // Create sample services
    const services = [
      {
        title: 'Consulting Services',
        slug: 'consulting-services',
        description: 'Expert consulting to help your business thrive.',
        fullDescription: 'Our consulting services provide strategic guidance and actionable insights.',
      },
      {
        title: 'Business Development',
        slug: 'business-development',
        description: 'Grow your business with our development strategies.',
        fullDescription: 'We help businesses identify opportunities and develop growth strategies.',
      },
      {
        title: 'Project Management',
        slug: 'project-management',
        description: 'Professional project management for successful delivery.',
        fullDescription: 'Our project management expertise ensures timely and efficient project completion.',
      },
    ];

    for (const service of services) {
      const existing = await strapi.entityService.findMany('api::service.service', {
        filters: { slug: service.slug },
      });

      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::service.service', {
          data: {
            ...service,
            publishedAt: new Date(),
          },
        });
        console.log(`✅ Created service: ${service.title}`);
      }
    }

    // Create sample blog posts
    const blogs = [
      {
        title: 'Getting Started with Business Growth',
        slug: 'getting-started-business-growth',
        excerpt: 'Learn the fundamentals of sustainable business growth.',
        body: 'Building a successful business requires strategic planning and execution...',
      },
      {
        title: '5 Tips for Effective Project Management',
        slug: 'effective-project-management-tips',
        excerpt: 'Discover key strategies for managing projects successfully.',
        body: 'Effective project management is crucial for delivering results on time and within budget...',
      },
    ];

    for (const blog of blogs) {
      const existing = await strapi.entityService.findMany('api::blog.blog', {
        filters: { slug: blog.slug },
      });

      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::blog.blog', {
          data: {
            ...blog,
            publishedAt: new Date(),
          },
        });
        console.log(`✅ Created blog: ${blog.title}`);
      }
    }

    // Create sample testimonials
    const testimonials = [
      {
        author: 'John Smith',
        company: 'Tech Innovations Inc',
        content: 'Helpables LLC provided exceptional service and helped us achieve our business goals.',
        rating: 5,
      },
      {
        author: 'Sarah Johnson',
        company: 'Global Solutions',
        content: 'Professional, reliable, and results-driven. Highly recommended!',
        rating: 5,
      },
    ];

    for (const testimonial of testimonials) {
      const existing = await strapi.entityService.findMany('api::testimonial.testimonial', {
        filters: { author: testimonial.author },
      });

      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::testimonial.testimonial', {
          data: {
            ...testimonial,
            publishedAt: new Date(),
          },
        });
        console.log(`✅ Created testimonial from: ${testimonial.author}`);
      }
    }

    // Create sample FAQs
    const faqs = [
      {
        question: 'What services do you offer?',
        answer: 'We offer a comprehensive range of business services including consulting, development, and project management.',
      },
      {
        question: 'How can I get started?',
        answer: 'Simply contact us through our website or give us a call to discuss your needs.',
      },
    ];

    for (const faq of faqs) {
      const existing = await strapi.entityService.findMany('api::faq.faq', {
        filters: { question: faq.question },
      });

      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::faq.faq', {
          data: {
            ...faq,
            publishedAt: new Date(),
          },
        });
        console.log(`✅ Created FAQ: ${faq.question}`);
      }
    }

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
