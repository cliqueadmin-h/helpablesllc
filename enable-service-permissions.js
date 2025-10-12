const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function enableServicePermissions() {
  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const jwt = loginData.data?.token || loginData.token;
    console.log('✓ Login successful!\n');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    // Get public role
    console.log('📥 Fetching public role...');
    const rolesResponse = await fetch(`${STRAPI_URL}/admin/users-permissions/roles`, { headers });
    const rolesData = await rolesResponse.json();
    
    const publicRole = rolesData.data?.find(role => role.type === 'public') || rolesData.roles?.find(role => role.type === 'public');
    
    if (!publicRole) {
      console.error('❌ Could not find public role');
      return;
    }

    console.log(`✓ Found public role (ID: ${publicRole.id})\n`);

    // Enable service permissions
    console.log('🔓 Enabling service permissions...');
    
    const updatedPermissions = {
      ...publicRole.permissions,
      'api::service.service': {
        controllers: {
          service: {
            find: { enabled: true },
            findOne: { enabled: true },
          },
        },
      },
    };

    const updateResponse = await fetch(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...publicRole,
        permissions: updatedPermissions,
      }),
    });

    if (updateResponse.ok) {
      console.log('✅ Service permissions enabled successfully!');
      console.log('   ✓ find - enabled');
      console.log('   ✓ findOne - enabled');
    } else {
      const error = await updateResponse.text();
      console.error('❌ Failed to update permissions:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

enableServicePermissions();
