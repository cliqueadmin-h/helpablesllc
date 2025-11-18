# Stripe Payment Integration - Environment Variables

This document outlines the environment variables required for the Stripe payment integration in the Helpables CMS.

## Required Environment Variables

Add these environment variables to your Railway deployment or local `.env` file:

### 1. STRIPE_SECRET_KEY
**Required**: Yes  
**Description**: Your Stripe secret API key (used for server-side operations)  
**Format**: `sk_test_...` (test mode) or `sk_live_...` (production mode)  
**Where to find**: 
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Click "Developers" → "API keys"
- Copy the "Secret key"

**Example**:
```env
STRIPE_SECRET_KEY=sk_test_51ABC123xyz...
```

### 2. STRIPE_PUBLISHABLE_KEY
**Required**: Yes (for mobile app)  
**Description**: Your Stripe publishable API key (used for client-side/mobile app)  
**Format**: `pk_test_...` (test mode) or `pk_live_...` (production mode)  
**Where to find**: 
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Click "Developers" → "API keys"
- Copy the "Publishable key"

**Example**:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123xyz...
```

**Note**: This key should be included in your mobile app's environment configuration.

### 3. STRIPE_WEBHOOK_SECRET
**Required**: Yes (for webhook signature verification)  
**Description**: Webhook signing secret for verifying Stripe webhook events  
**Format**: `whsec_...`  
**Where to find**: 
- Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
- Click "Developers" → "Webhooks"
- Click "Add endpoint"
- Enter your webhook URL: `https://your-strapi-url.railway.app/api/payment/webhook`
- Select events to listen for (recommended: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`, `charge.refunded`)
- Click "Add endpoint"
- Copy the "Signing secret"

**Example**:
```env
STRIPE_WEBHOOK_SECRET=whsec_ABC123xyz...
```

## Setting Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your Strapi service
3. Go to the "Variables" tab
4. Add each environment variable:
   - Click "New Variable"
   - Enter variable name (e.g., `STRIPE_SECRET_KEY`)
   - Enter variable value
   - Click "Add"
5. Railway will automatically redeploy your service with the new variables

## Setting Environment Variables Locally

Create or update `cms/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important**: Never commit `.env` file to version control. It's already in `.gitignore`.

## Webhook URL Configuration

After deploying to Railway, configure your Stripe webhook:

1. **Production URL**: `https://helpablesllc-production.up.railway.app/api/payment/webhook`
2. **Local Testing URL**: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:1337/api/payment/webhook
   ```

## Events to Listen For

Configure your Stripe webhook to listen for these events:

- ✅ `payment_intent.succeeded` - Payment completed successfully
- ✅ `payment_intent.payment_failed` - Payment failed
- ✅ `payment_intent.canceled` - Payment canceled by user
- ✅ `charge.refunded` - Payment refunded

## Testing

### Test Mode Keys
Use test mode keys (starting with `sk_test_` and `pk_test_`) for development and testing. Test mode keys will not process real payments.

### Test Card Numbers
Use these test card numbers in your mobile app:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Any future expiry date (e.g., 12/34) and any 3-digit CVC will work.

### Verifying Setup

1. Check Strapi logs for `Payment succeeded:` messages
2. Verify order status updates in Strapi admin panel
3. Test webhook delivery in Stripe dashboard → Webhooks → View logs

## Security Notes

- ✅ All webhook events are verified using signature verification
- ✅ Payment routes are public (`auth: false`) but secured by Stripe's signature
- ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
- ✅ Only use `STRIPE_PUBLISHABLE_KEY` in your mobile app
- ✅ Test mode keys are safe to use during development

## Mobile App Configuration

In your React Native app, you'll need:

```javascript
// .env or config file in React Native app
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRAPI_API_URL=https://helpablesllc-production.up.railway.app
```

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
