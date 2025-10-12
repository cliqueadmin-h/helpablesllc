const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function enableEmailPermission() {
  try {
    console.log('🔧 Enable Email Plugin Send Permission\n');
    
    const baseURL = await question('Enter Railway URL (https://helpablesllc-production.up.railway.app): ');
    const identifier = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    
    rl.close();

    const url = baseURL.trim() || 'https://helpablesllc-production.up.railway.app';

    console.log('\n📡 Logging in to admin...');
    
    // Login to get JWT token
    const loginResponse = await axios.post(`${url}/admin/login`, {
      email: identifier.trim(),
      password: password.trim()
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');

    // Get all roles
    console.log('\n🔍 Fetching roles...');
    const rolesResponse = await axios.get(`${url}/admin/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const roles = rolesResponse.data.data;
    console.log(`Found ${roles.length} roles:`, roles.map(r => `${r.name} (ID: ${r.id})`).join(', '));

    // Find public role
    const publicRole = roles.find(r => r.code === 'strapi-author' || r.name.toLowerCase() === 'public');
    
    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log(`\n📋 Using role: ${publicRole.name} (ID: ${publicRole.id})`);

    // Get current permissions
    console.log('\n🔍 Fetching current permissions...');
    const permissionsResponse = await axios.get(`${url}/admin/roles/${publicRole.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    let permissions = permissionsResponse.data.data.permissions;
    console.log(`Current permissions count: ${Object.keys(permissions).length}`);

    // Check if email plugin permissions exist
    if (!permissions.plugin) {
      permissions.plugin = {};
    }
    if (!permissions.plugin.email) {
      permissions.plugin.email = {};
    }
    if (!permissions.plugin.email.controllers) {
      permissions.plugin.email.controllers = {};
    }
    if (!permissions.plugin.email.controllers.email) {
      permissions.plugin.email.controllers.email = {};
    }

    // Enable send action
    permissions.plugin.email.controllers.email.send = {
      enabled: true
    };

    console.log('\n📝 Updating permissions to enable email.send...');

    // Update role with new permissions
    const updateResponse = await axios.put(
      `${url}/admin/roles/${publicRole.id}`,
      {
        name: publicRole.name,
        description: publicRole.description,
        permissions: permissions
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Email send permission enabled successfully!');
    console.log('\n🎯 Email plugin can now send emails from lifecycle hooks');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please check your credentials.');
    }
  }
}

enableEmailPermission();
