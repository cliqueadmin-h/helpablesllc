/**
 * Get JWT token from Strapi
 * Usage: node get-jwt-token.js <email> <password>
 */

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

async function getJWTToken(identifier, password) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Authentication successful!');
      console.log('\nJWT Token:');
      console.log(data.jwt);
      console.log('\nUser Info:');
      console.log(`  ID: ${data.user.id}`);
      console.log(`  Username: ${data.user.username}`);
      console.log(`  Email: ${data.user.email}`);
      return data.jwt;
    } else {
      console.error('❌ Authentication failed:');
      console.error(JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Get credentials from command line
const identifier = process.argv[2];
const password = process.argv[3];

if (!identifier || !password) {
  console.log('Usage: node get-jwt-token.js <email> <password>');
  console.log('Example: node get-jwt-token.js user@example.com mypassword');
  process.exit(1);
}

getJWTToken(identifier, password);
