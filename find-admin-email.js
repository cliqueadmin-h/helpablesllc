/**
 * Script to find admin user email
 * Run this in Railway Strapi console or locally with DATABASE_URL
 */

const axios = require('axios');

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

async function findAdminEmail() {
  console.log('🔍 Checking for admin users...\n');
  
  try {
    // Try to get admin users (this won't work without auth, but we can check the database directly)
    console.log('📋 To find your admin email, you need to:');
    console.log('\n1. Go to Railway dashboard: https://railway.app');
    console.log('2. Open your Strapi project');
    console.log('3. Click on the "Data" tab');
    console.log('4. Look for the "admin_users" table');
    console.log('5. Check the "email" column\n');
    
    console.log('OR\n');
    
    console.log('1. Go to Railway dashboard');
    console.log('2. Click on your Strapi service');
    console.log('3. Click "Connect" button (top right)');
    console.log('4. Use the provided connection to access PostgreSQL');
    console.log('5. Run this query:');
    console.log('   SELECT email, username FROM admin_users;\n');
    
    console.log('OR try these common emails:');
    console.log('  - admin@helpables.com');
    console.log('  - cliqueadmin@helpables.org');
    console.log('  - admin@example.com');
    console.log('  - Your personal email you might have used\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findAdminEmail();
