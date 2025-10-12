const axios = require('axios');

const baseURL = 'https://helpablesllc-production.up.railway.app';

async function testEmail() {
  try {
    console.log('🧪 Testing email endpoint...\n');
    console.log(`URL: ${baseURL}/api/contact-submissions/test-email\n`);
    
    const response = await axios.get(`${baseURL}/api/contact-submissions/test-email`, {
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Response Status:', response.status);
    console.log('📧 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n✅ Email sent successfully!');
      console.log('📬 Check cliqueadmin@helpables.org for the test email');
    }
  } catch (error) {
    console.error('\n❌ Error testing email:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out after 30 seconds');
      console.error('This suggests the email sending is taking too long or hanging');
    } else {
      console.error(error.message);
    }
  }
}

testEmail();
