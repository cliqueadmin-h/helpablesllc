# Automation API Permissions Setup

## Issue
The automation API endpoints are returning 403 Forbidden even with valid JWT tokens because Strapi's role-based access control (RBAC) hasn't granted permissions to authenticated users yet.

## Solution

### Option 1: Via Strapi Admin Panel (Recommended)

1. **Login to Strapi Admin**
   - Go to: https://helpablesllc-production.up.railway.app/admin
   - Login with your admin credentials

2. **Navigate to Permissions**
   - Settings (⚙️) → Users & Permissions Plugin → Roles
   - Click on "Authenticated" role

3. **Enable Automation Permissions**
   - Scroll down to find "Automation" section
   - Check the boxes for:
     - ✅ `triggerSignup`
     - ✅ `triggerWorkflow`
   - Click "Save" button

4. **Test Again**
   - Run: `node test-complete.js`
   - Should now return success responses

### Option 2: Via Database (Manual)

If you have direct database access, you can update permissions directly:

```sql
-- Find the authenticated role ID
SELECT id FROM up_roles WHERE type = 'authenticated';

-- Grant permissions for automation endpoints
INSERT INTO up_permissions (action, subject, properties, conditions, role_id)
VALUES 
  ('api::automation.automation.triggerSignup', NULL, '{}', '[]', <role_id>),
  ('api::automation.automation.triggerWorkflow', NULL, '{}', '[]', <role_id>);
```

### Option 3: Bootstrap Configuration (Permanent)

Create a bootstrap file to automatically set permissions on deployment:

**File: `cms/config/functions/bootstrap.js`**

```javascript
module.exports = async () => {
  const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  const permissions = [
    {
      action: 'api::automation.automation.triggerSignup',
      subject: null,
    },
    {
      action: 'api::automation.automation.triggerWorkflow',
      subject: null,
    },
  ];

  for (const permission of permissions) {
    const exists = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({
        where: {
          action: permission.action,
          role: authenticatedRole.id,
        },
      });

    if (!exists) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: permission.action,
          subject: permission.subject,
          role: authenticatedRole.id,
          enabled: true,
        },
      });
    }
  }

  console.log('✅ Automation API permissions configured');
};
```

## Current Test Results

✅ **Working:**
- User registration (test@helpables.io created)
- JWT token generation
- Authentication middleware (returns 403 for unauthorized requests)
- API deployment on Railway

⚠️ **Needs Configuration:**
- Authenticated user permissions for automation endpoints
- n8n environment variables (N8N_WEBHOOK_URL, N8N_API_KEY)

## Test User Credentials

```
Email: test@helpables.io
Password: Test123!@#
JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzY0MTQ2MTUwLCJleHAiOjE3NjY3MzgxNTB9._a06xm2l706-plcpsW_W_UNNRS4AR4GhRqbJKhDpk-k
```

## Next Steps

1. ✅ Complete: User authentication
2. ✅ Complete: API deployment
3. 🔧 **TODO**: Enable permissions in Strapi admin (see Option 1 above)
4. 🔧 **TODO**: Add environment variables to Railway:
   - N8N_WEBHOOK_URL
   - N8N_API_KEY
5. 🔧 **TODO**: Test with n8n webhook configured
6. 🔧 **TODO**: Integrate into React Native app
