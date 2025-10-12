const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function enableContactPermissions() {
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

    // Enable contact-submission permissions
    console.log('🔓 Enabling contact-submission permissions...');
    
    const updatedPermissions = {
      ...publicRole.permissions,
      'api::contact-submission.contact-submission': {
        controllers: {
          'contact-submission': {
            create: { enabled: true },
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
      console.log('✅ Contact submission permissions enabled successfully!');
      console.log('   ✓ create - enabled');
      console.log('\n🎉 You can now submit contact forms from the frontend!');
    } else {
      const error = await updateResponse.text();
      console.error('❌ Failed to update permissions:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

enableContactPermissions();
