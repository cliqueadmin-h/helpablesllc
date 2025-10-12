const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

// You'll need to provide admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@helpables.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const services = [
  {
    title: 'Jamstack Website Development',
    description: 'We build blazing-fast, secure, and SEO-friendly Jamstack websites using Next.js, Strapi, and modern DevOps workflows. Each site is optimized for performance, scalability, and effortless content updates — empowering your business with an enterprise-grade web foundation.',
    icon: '🌐',
    order: 1,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'AI Chatbots & Automation',
    description: 'Integrate intelligent, context-aware chatbots powered by GPT and automation workflows that enhance user engagement, reduce support time, and personalize experiences. From onboarding assistants to custom AI tools, we help you scale human-like interactions seamlessly.',
    icon: '🤖',
    order: 2,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Payment & Scheduling Integration',
    description: 'We connect your digital experience with powerful business tools — from secure Stripe checkout flows to Cal.com and Calendly booking systems. Our integrations streamline transactions, bookings, and client communications effortlessly across devices.',
    icon: '💼',
    order: 3,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Analytics & Growth Insights',
    description: 'Track, understand, and grow your digital impact. We integrate GA4, PostHog, and custom dashboards to visualize performance, uncover customer behavior, and make data-driven decisions that fuel your next phase of growth.',
    icon: '📈',
    order: 4,
    publishedAt: new Date().toISOString(),
  },
];

async function updateServices() {
  try {
    // First, login as admin to get JWT token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login failed:', error);
      console.log('\n💡 Please run the script again with correct admin credentials');
      return;
    }

    const loginData = await loginResponse.json();
    const jwt = loginData.data?.token || loginData.token;
    
    if (!jwt) {
      console.error('❌ No token received from login');
      return;
    }
    
    console.log('✓ Login successful!');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    // First, get all existing services
    console.log('\n📥 Fetching existing services...');
    const response = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, { 
      headers,
      method: 'GET',
    });
    const data = await response.json();
    
    const existingServices = data.results || data.data || [];
    console.log(`Found ${existingServices.length} existing services`);
    
    // Delete all existing services
    if (existingServices.length > 0) {
      console.log('🗑️  Deleting existing services...');
      for (const service of existingServices) {
        const serviceId = service.id || service.documentId;
        const serviceTitle = service.title || service.attributes?.title;
        const deleteResponse = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service/${serviceId}`, {
          method: 'DELETE',
          headers,
        });
        if (deleteResponse.ok) {
          console.log(`   ✓ Deleted: ${serviceTitle}`);
        } else {
          const error = await deleteResponse.text();
          console.log(`   ✗ Failed to delete: ${serviceTitle}`);
          console.log(`     Error: ${error}`);
        }
      }
    }
    
    // Create new services
    console.log('\n📝 Creating new services...');
    for (const service of services) {
      const createResponse = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, {
        method: 'POST',
        headers,
        body: JSON.stringify(service),
      });
      
      if (createResponse.ok) {
        console.log(`   ✓ Created: ${service.title}`);
      } else {
        const error = await createResponse.text();
        console.log(`   ✗ Failed to create: ${service.title}`);
        console.log(`     Error: ${error}`);
      }
    }
    
    console.log('\n✅ Services updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating services:', error.message);
  }
}

updateServices();
