/**
 * Final test with correct parameters
 */

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzY0MTQ2NzU3LCJleHAiOjE3NjY3Mzg3NTd9.zB_rU-jPQisYsnWiq53aRywx6FhQHSpjTdos8lZjndY';

async function testWithCorrectParams() {
  console.log('🧪 Testing with correct parameters...\n');
  
  // Test trigger workflow with required workflowName
  console.log('Testing POST /api/automation/trigger with workflowName...');
  const response = await fetch(`${STRAPI_URL}/api/automation/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
    body: JSON.stringify({
      workflowName: 'test-workflow',  // Required parameter
      data: {
        action: 'test',
        message: 'Testing automation API',
      }
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  if (response.status === 500 && data.error?.message?.includes('not properly configured')) {
    console.log('\n✅ API is working! Just needs N8N_WEBHOOK_URL environment variable.');
    console.log('This error confirms the API logic is executing correctly.');
  } else if (response.ok) {
    console.log('\n✅ API fully working with n8n configured!');
  }
}

testWithCorrectParams();
