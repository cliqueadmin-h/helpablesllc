const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function checkServices() {
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

    // Check services via admin API
    console.log('📥 Fetching services from admin API...');
    const response = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, { 
      headers 
    });
    
    const data = await response.json();
    const services = data.results || [];
    
    console.log(`Found ${services.length} services in admin:\n`);
    
    services.forEach((service, i) => {
      console.log(`${i + 1}. ${service.title}`);
      console.log(`   Icon: ${service.icon}`);
      console.log(`   Order: ${service.order}`);
      console.log(`   Published: ${service.publishedAt ? '✅ Yes' : '❌ No (DRAFT)'}`);
      console.log('');
    });

    // Now check public API
    console.log('\n📡 Testing public API...');
    const publicResponse = await fetch(`${STRAPI_URL}/api/services?populate=*`);
    const publicData = await publicResponse.json();
    
    console.log(`Public API returned: ${publicData.data?.length || 0} services`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkServices();
