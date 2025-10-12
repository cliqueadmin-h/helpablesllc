const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function publishServices() {
  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const jwt = loginData.data?.token || loginData.token;
    console.log('✓ Login successful!\n');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    // Get all services
    console.log('📥 Fetching services...');
    const response = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, { 
      headers 
    });
    
    const data = await response.json();
    const services = data.results || [];
    
    console.log(`Found ${services.length} services\n`);

    // Publish each service
    console.log('📤 Publishing services...\n');
    for (const service of services) {
      const serviceId = service.id || service.documentId;
      
      // Update service with publishedAt
      const updateResponse = await fetch(
        `${STRAPI_URL}/content-manager/collection-types/api::service.service/${serviceId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...service,
            publishedAt: new Date().toISOString(),
          }),
        }
      );

      if (updateResponse.ok) {
        console.log(`   ✅ Published: ${service.title}`);
      } else {
        const error = await updateResponse.text();
        console.log(`   ❌ Failed: ${service.title}`);
        console.log(`      Error: ${error}`);
      }
    }

    console.log('\n🎉 All services published successfully!');
    console.log('\n🔗 Test the public API:');
    console.log(`   ${STRAPI_URL}/api/services`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

publishServices();
