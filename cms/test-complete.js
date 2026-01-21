/**
 * Check Strapi users and create a test user if needed
 */

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

async function registerTestUser() {
  console.log('🔧 Creating test user...');
  
  const testUser = {
    username: 'testuser',
    email: 'test@helpables.io',
    password: 'Test123!@#',
  };
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test user created successfully!');
      console.log('\nCredentials:');
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Password: ${testUser.password}`);
      console.log('\nJWT Token:');
      console.log(data.jwt);
      console.log('\nUser Info:');
      console.log(`  ID: ${data.user.id}`);
      console.log(`  Username: ${data.user.username}`);
      console.log(`  Email: ${data.user.email}`);
      return data.jwt;
    } else {
      console.log('ℹ️  User might already exist or registration is disabled');
      console.log('Response:', JSON.stringify(data, null, 2));
      
      // Try to login with existing credentials
      console.log('\n🔑 Trying to login with test credentials...');
      return await loginTestUser(testUser.email, testUser.password);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function loginTestUser(identifier, password) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('\nJWT Token:');
      console.log(data.jwt);
      return data.jwt;
    } else {
      console.log('❌ Login failed. You need to create a user manually.');
      console.log('\nOptions:');
      console.log('1. Go to Strapi Admin: https://helpablesllc-production.up.railway.app/admin');
      console.log('2. Navigate to Content Manager > User (users-permissions)');
      console.log('3. Create a new user with email and password');
      console.log('4. Or enable public registration in Settings > Users & Permissions Plugin > Advanced Settings');
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testAutomationWithToken(token) {
  console.log('\n' + '═'.repeat(60));
  console.log('🧪 Testing Automation API with JWT token...');
  console.log('═'.repeat(60));
  
  // Test trigger-signup
  console.log('\n1️⃣ Testing POST /api/automation/trigger-signup...');
  try {
    const response = await fetch(`${STRAPI_URL}/api/automation/trigger-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        additionalData: {
          source: 'test-script',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ trigger-signup working!');
    } else {
      console.log('⚠️  Response received (might need n8n config)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test trigger workflow
  console.log('\n2️⃣ Testing POST /api/automation/trigger...');
  try {
    const response = await fetch(`${STRAPI_URL}/api/automation/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        workflowType: 'test-workflow',
        data: {
          action: 'test',
          message: 'Testing automation API',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ trigger workflow working!');
    } else {
      console.log('⚠️  Response received (might need n8n config)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function run() {
  console.log('🚀 Strapi User Check & Automation API Test');
  console.log('Target:', STRAPI_URL);
  console.log('═'.repeat(60));
  
  const token = await registerTestUser();
  
  if (token) {
    await testAutomationWithToken(token);
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ Testing Complete!');
    console.log('\nNext Steps:');
    console.log('1. Add environment variables to Railway:');
    console.log('   - N8N_WEBHOOK_URL (your n8n webhook URL)');
    console.log('   - N8N_API_KEY (secure API key for authentication)');
    console.log('2. Configure n8n webhook with Header Auth: X-N8N-API-KEY');
    console.log('3. Use the JWT token above in your React Native app');
    console.log('═'.repeat(60));
  }
}

run().catch(console.error);
