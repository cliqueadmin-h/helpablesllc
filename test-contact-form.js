const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

async function testContactSubmission() {
  try {
    console.log('🧪 Testing contact form submission...\n');
    
    const testData = {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-1234',
        subject: 'Test Submission',
        message: 'This is a test message from the API test script.'
      }
    };

    console.log('📤 Sending test submission...');
    const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Status:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Success! Contact form submitted.');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('\n📧 Email should have been sent to cliqueadmin@helpables.org');
    } else {
      const error = await response.text();
      console.log('\n❌ Failed to submit form');
      console.log('Error:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContactSubmission();
