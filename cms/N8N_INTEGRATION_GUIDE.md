# Strapi-to-n8n Integration Guide

## Environment Variables

Add these to your Railway environment variables or local `.env` file:

```env
# N8N Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/signup-automation
N8N_API_KEY=your-n8n-api-key-here

# Example URLs:
# N8N_WEBHOOK_URL=https://n8n.helpables.io/webhook/user-signup
# N8N_WEBHOOK_URL=https://app.n8n.cloud/webhook/abc123def456
```

## Railway Setup

1. Go to your Railway Strapi service
2. Navigate to "Variables" tab
3. Add:
   - Variable name: `N8N_WEBHOOK_URL`
   - Value: Your n8n webhook URL
   - Click "Add"
4. Add:
   - Variable name: `N8N_API_KEY`
   - Value: Your n8n API key
   - Click "Add"
5. Railway will automatically redeploy

## n8n Setup

### 1. Create Webhook Trigger

In your n8n workflow:
1. Add a **Webhook** node
2. Set **HTTP Method**: POST
3. Set **Path**: `/webhook/signup-automation` (or your preferred path)
4. Set **Authentication**: Header Auth
5. Set **Header Name**: `X-N8N-API-KEY`
6. Set **Header Value**: Your API key (generate a secure random string)
7. Copy the **Webhook URL** from n8n

### 2. Webhook Payload Structure

Your n8n workflow will receive:

```json
{
  "userId": 1,
  "userEmail": "user@example.com",
  "username": "johndoe",
  "timestamp": "2024-01-15T10:30:00.000Z",
  ...additionalData
}
```

For the general trigger endpoint:

```json
{
  "workflow": "workflow-name",
  "userId": 1,
  "userEmail": "user@example.com",
  "username": "johndoe",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    ...customWorkflowData
  }
}
```

## React Native Integration

### 1. Install axios (if not already installed)

```bash
npm install axios
```

### 2. Create API service

```javascript
// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

// Get JWT token from storage
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('jwt_token');
  return token;
};

// Trigger signup automation
export const triggerSignupAutomation = async (additionalData = {}) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${STRAPI_URL}/api/automation/trigger-signup`,
      additionalData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error?.message || 'Failed to trigger automation');
    } else if (error.request) {
      // No response received
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
};

// Trigger general workflow
export const triggerWorkflow = async (workflowName, workflowData = {}) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${STRAPI_URL}/api/automation/trigger`,
      {
        workflowName,
        workflowData,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Failed to trigger workflow');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
};
```

### 3. Usage in React Native Components

```javascript
// SignupSuccessScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { triggerSignupAutomation } from '../services/api';

export default function SignupSuccessScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleSignupAutomation();
  }, []);

  const handleSignupAutomation = async () => {
    try {
      const result = await triggerSignupAutomation({
        source: 'mobile_app',
        platform: 'react-native',
        customField: 'value',
      });

      console.log('Automation triggered:', result);
      Alert.alert('Success', 'Welcome! Your account setup is in progress.');
    } catch (error) {
      console.error('Automation error:', error.message);
      // Don't show error to user - automation is optional
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Setting up your account...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome! Your account is ready.</Text>
    </View>
  );
}
```

### 4. Alternative: Using fetch instead of axios

```javascript
// Using native fetch API
export const triggerSignupAutomation = async (additionalData = {}) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      'https://helpablesllc-production.up.railway.app/api/automation/trigger-signup',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(additionalData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to trigger automation');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
```

## API Endpoints

### Trigger Signup Automation

**Endpoint**: `POST /api/automation/trigger-signup`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body** (optional):
```json
{
  "source": "mobile_app",
  "platform": "react-native",
  "customField": "value"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Automation triggered successfully",
  "data": {
    "userId": 1,
    "triggeredAt": "2024-01-15T10:30:00.000Z",
    "workflowStatus": { ...n8nResponse }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: No JWT token or invalid token
- `400 Bad Request`: n8n webhook failed
- `500 Internal Server Error`: n8n service unavailable or misconfigured

### Trigger General Workflow

**Endpoint**: `POST /api/automation/trigger`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "workflowName": "send-welcome-email",
  "workflowData": {
    "emailType": "welcome",
    "priority": "high"
  }
}
```

## Security Features

✅ **JWT Authentication**: Only authenticated users can trigger workflows  
✅ **API Key Hidden**: N8N_API_KEY never exposed to client  
✅ **User Context**: User ID automatically included in payload  
✅ **Error Handling**: Proper error messages without exposing sensitive data  
✅ **Timeout Protection**: 30-second timeout prevents hanging requests  
✅ **Logging**: All automation triggers are logged for audit trail  

## Testing

### Test with cURL (after user authentication)

```bash
# First, login to get JWT token
curl -X POST https://helpablesllc-production.up.railway.app/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{"identifier": "user@example.com", "password": "password123"}'

# Copy the JWT token from response, then:
curl -X POST https://helpablesllc-production.up.railway.app/api/automation/trigger-signup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source": "test", "testField": "testValue"}'
```

### Test with Postman

1. **Login Request**:
   - Method: POST
   - URL: `https://helpablesllc-production.up.railway.app/api/auth/local`
   - Body: `{"identifier": "email", "password": "password"}`
   - Save JWT from response

2. **Trigger Automation**:
   - Method: POST
   - URL: `https://helpablesllc-production.up.railway.app/api/automation/trigger-signup`
   - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
   - Body: Any JSON data you want to send to n8n

## Troubleshooting

### "Automation service is not properly configured"
- Check that `N8N_WEBHOOK_URL` and `N8N_API_KEY` are set in Railway environment variables
- Restart Strapi service after adding environment variables

### "Could not reach automation service"
- Verify n8n webhook URL is correct and accessible
- Check n8n service is running
- Test webhook URL directly with cURL

### "Failed to trigger automation workflow"
- Check n8n webhook authentication header name matches `X-N8N-API-KEY`
- Verify API key in n8n webhook node matches environment variable
- Check n8n logs for detailed error messages

### "You must be authenticated to trigger this automation"
- Ensure JWT token is valid and not expired
- Check Authorization header format: `Bearer TOKEN`
- Verify user is logged in to Strapi

## Next Steps

1. ✅ Add environment variables to Railway
2. ✅ Create n8n workflow with webhook trigger
3. ✅ Deploy Strapi changes
4. ✅ Integrate API calls in React Native app
5. ✅ Test end-to-end flow
6. ✅ Monitor n8n workflow executions
7. ✅ Set up error notifications in n8n (optional)

## Example n8n Workflow

```
Webhook Trigger (POST /webhook/signup-automation)
  ↓
Check API Key Header
  ↓
Send Welcome Email (Email Node)
  ↓
Create CRM Contact (HTTP Request Node)
  ↓
Slack Notification (Slack Node)
  ↓
Return Success Response
```

Your workflow can now be triggered securely from your mobile app!
