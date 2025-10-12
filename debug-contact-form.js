const axios = require('axios');

const baseURL = 'https://helpablesllc-production.up.railway.app';

async function testContactSubmission() {
  try {
    console.log('🧪 Testing Contact Form Submission...\n');
    console.log(`URL: ${baseURL}/api/contact-submissions\n`);
    
    const startTime = Date.now();
    
    const testData = {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-1234',
        subject: 'Test Subject',
        message: 'This is a test message from the debug script'
      }
    };

    console.log('Sending test submission...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(
      `${baseURL}/api/contact-submissions`,
      testData,
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n✅ Success!');
    console.log('Status:', response.status);
    console.log('Duration:', duration, 'seconds');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (duration > 10) {
      console.log('\n⚠️ WARNING: Request took longer than 10 seconds');
      console.log('This suggests email sending may be slow or timing out');
    }

    console.log('\n📬 Check cliqueadmin@helpables.org for the email notification');
    
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.error('\n❌ Error after', duration, 'seconds:');
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️  REQUEST TIMED OUT (30 seconds)');
      console.error('Likely causes:');
      console.error('  - Email sending is hanging');
      console.error('  - SMTP connection issues');
      console.error('  - Missing email plugin permissions');
    } else if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 403) {
        console.error('\n🔒 Permission denied. Check Strapi permissions:');
        console.error('  - Public role needs "create" for contact-submissions');
        console.error('  - Email plugin needs "send" permission');
      }
    } else {
      console.error('Message:', error.message);
      console.error('Code:', error.code);
    }
  }
}

const startTime = Date.now();
testContactSubmission();
