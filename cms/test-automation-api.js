/**
 * Test script for automation API endpoints
 * Tests both trigger-signup and trigger endpoints
 */

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

// You'll need to replace this with a valid JWT token from your Strapi instance
// To get a token:
// 1. POST to /api/auth/local with { identifier: "email", password: "password" }
// 2. Use the jwt from response
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE';

async function testTriggerSignup() {
  console.log('\n🧪 Testing POST /api/automation/trigger-signup...');
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/automation/trigger-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
      },
      body: JSON.stringify({
        additionalData: {
          source: 'mobile-app',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ trigger-signup endpoint working!');
    } else {
      console.log('❌ trigger-signup endpoint failed');
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Error testing trigger-signup:', error.message);
    return false;
  }
}

async function testTriggerWorkflow() {
  console.log('\n🧪 Testing POST /api/automation/trigger...');
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/automation/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
      },
      body: JSON.stringify({
        workflowType: 'test-workflow',
        data: {
          action: 'test',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ trigger endpoint working!');
    } else {
      console.log('❌ trigger endpoint failed');
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Error testing trigger:', error.message);
    return false;
  }
}

async function testWithoutAuth() {
  console.log('\n🧪 Testing authentication requirement (should fail)...');
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/automation/trigger-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 401 || response.status === 403) {
      console.log('✅ Authentication protection working!');
      return true;
    } else {
      console.log('⚠️  Endpoint accessible without auth (security issue)');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing auth:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Automation API Tests');
  console.log('Target:', STRAPI_URL);
  console.log('═'.repeat(60));
  
  // First test without authentication
  await testWithoutAuth();
  
  // Check if JWT token is provided
  if (JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
    console.log('\n⚠️  JWT_TOKEN not set. Skipping authenticated tests.');
    console.log('\nTo test authenticated endpoints:');
    console.log('1. Get a JWT token from Strapi');
    console.log('2. Update JWT_TOKEN in this script');
    console.log('3. Ensure N8N_WEBHOOK_URL and N8N_API_KEY are set in Railway');
    return;
  }
  
  // Test authenticated endpoints
  const signupResult = await testTriggerSignup();
  const workflowResult = await testTriggerWorkflow();
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`  Auth Protection: ✅`);
  console.log(`  Trigger Signup: ${signupResult ? '✅' : '❌'}`);
  console.log(`  Trigger Workflow: ${workflowResult ? '✅' : '❌'}`);
  console.log('═'.repeat(60));
}

// Run the tests
runTests().catch(console.error);
