// Test if services API is working
const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

async function testServicesAPI() {
  try {
    console.log('🔍 Testing services API...\n');
    
    const response = await fetch(`${STRAPI_URL}/api/services?populate=*&publicationState=live`);
    console.log('Status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('\nResponse data:', JSON.stringify(data, null, 2));
    
    if (data.data) {
      console.log(`\n✅ Found ${data.data.length} services`);
      data.data.forEach((service, i) => {
        console.log(`\n${i + 1}. ${service.attributes?.title || 'No title'}`);
        console.log(`   Icon: ${service.attributes?.icon || 'No icon'}`);
        console.log(`   Order: ${service.attributes?.order || 'No order'}`);
      });
    } else {
      console.log('\n⚠️ No data array in response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testServicesAPI();
