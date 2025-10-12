#!/usr/bin/env node

/**
 * Script to enable public API permissions via Strapi Admin API
 * This will authenticate as admin and enable find/findOne for all content types
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://helpablesllc-production.up.railway.app';

async function login() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question('Enter admin email: ', (email) => {
      readline.question('Enter admin password: ', (password) => {
        readline.close();
        resolve({ email, password });
      });
    });
  });
}

async function enablePublicPermissions() {
  console.log('🔐 Logging in to Strapi admin...');
  
  // Get admin credentials
  const credentials = await login();
  
  // Login to get JWT
  const loginResponse = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!loginResponse.ok) {
    console.error('❌ Login failed:', loginResponse.statusText);
    const error = await loginResponse.text();
    console.error(error);
    process.exit(1);
  }

  const { data } = await loginResponse.json();
  const token = data.token;
  console.log('✅ Successfully logged in');

  // Get all roles
  console.log('\n📋 Fetching roles...');
  const rolesResponse = await fetch(`${STRAPI_URL}/admin/users-permissions/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!rolesResponse.ok) {
    console.error('❌ Failed to fetch roles');
    process.exit(1);
  }

  const rolesData = await rolesResponse.json();
  const publicRole = rolesData.roles.find(role => role.type === 'public');

  if (!publicRole) {
    console.error('❌ Public role not found');
    process.exit(1);
  }

  console.log(`✅ Found public role (ID: ${publicRole.id})`);

  // Get current permissions
  console.log('\n📋 Current permissions:');
  console.log(JSON.stringify(publicRole.permissions, null, 2));

  // Update permissions - enable find and findOne for all content types
  const contentTypes = ['blog', 'service', 'testimonial', 'homepage', 'faq'];
  const updatedPermissions = { ...publicRole.permissions };

  for (const contentType of contentTypes) {
    if (!updatedPermissions[contentType]) {
      updatedPermissions[contentType] = {
        controllers: {
          [contentType]: {
            find: { enabled: true },
            findOne: { enabled: true },
          },
        },
      };
    } else {
      if (!updatedPermissions[contentType].controllers) {
        updatedPermissions[contentType].controllers = {};
      }
      if (!updatedPermissions[contentType].controllers[contentType]) {
        updatedPermissions[contentType].controllers[contentType] = {};
      }
      updatedPermissions[contentType].controllers[contentType].find = { enabled: true };
      updatedPermissions[contentType].controllers[contentType].findOne = { enabled: true };
    }
    console.log(`✅ Enabled find/findOne for ${contentType}`);
  }

  // Update the role
  console.log('\n💾 Updating public role permissions...');
  const updateResponse = await fetch(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: publicRole.name,
      description: publicRole.description,
      permissions: updatedPermissions,
    }),
  });

  if (!updateResponse.ok) {
    console.error('❌ Failed to update role');
    const error = await updateResponse.text();
    console.error(error);
    process.exit(1);
  }

  console.log('🎉 Successfully updated public role permissions!');
  console.log('\n🧪 Testing API endpoints...\n');

  // Test the endpoints
  const endpoints = ['blogs', 'services', 'testimonials', 'homepage', 'faqs'];
  for (const endpoint of endpoints) {
    const testResponse = await fetch(`${STRAPI_URL}/api/${endpoint}`);
    const status = testResponse.ok ? '✅' : '❌';
    console.log(`${status} /api/${endpoint} - ${testResponse.status} ${testResponse.statusText}`);
  }
}

enablePublicPermissions().catch(console.error);
