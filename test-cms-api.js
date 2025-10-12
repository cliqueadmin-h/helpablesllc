#!/usr/bin/env node

/**
 * Test script to verify CMS API endpoints
 * Usage: node test-cms-api.js
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://helpablesllc-production.up.railway.app';

async function testEndpoint(endpoint) {
  try {
    const url = `${STRAPI_URL}/api/${endpoint}`;
    console.log(`\nTesting: ${url}`);
    
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS - Found ${data.data?.length || 0} items`);
      return true;
    } else {
      console.log(`❌ FAILED - ${data.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing CMS API Endpoints');
  console.log(`📍 CMS URL: ${STRAPI_URL}`);
  console.log('='.repeat(50));

  const endpoints = ['blogs', 'services', 'testimonials', 'homepage', 'faqs'];
  const results = [];

  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    results.push({ endpoint, success });
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  results.forEach(({ endpoint, success }) => {
    console.log(`  ${success ? '✅' : '❌'} ${endpoint}`);
  });

  const allSuccess = results.every(r => r.success);
  console.log('\n' + (allSuccess ? '🎉 All endpoints working!' : '⚠️  Some endpoints need configuration'));
  
  if (!allSuccess) {
    console.log('\n💡 To fix:');
    console.log('1. Go to: https://helpablesllc-production.up.railway.app/admin');
    console.log('2. Settings → Users & Permissions → Roles → Public');
    console.log('3. Enable "find" and "findOne" for all content types');
    console.log('4. Save and retry this test');
  }
}

main();
