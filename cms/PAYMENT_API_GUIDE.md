# Stripe Payment API - Usage Guide

## Overview

The Helpables CMS now includes a complete Stripe payment integration for your React Native mobile app. This guide explains how to use the payment APIs.

## Architecture

```
Mobile App → Strapi CMS → Stripe API
```

- **Mobile App**: Creates payment intents and handles payment UI
- **Strapi CMS**: Backend API that communicates with Stripe
- **Stripe API**: Processes payments and sends webhooks

## API Endpoints

Base URL: `https://helpablesllc-production.up.railway.app/api`

### 1. Create Payment Intent

**Endpoint**: `POST /payment/create-intent`

**Description**: Creates a new payment intent and order record.

**Request Body**:
```json
{
  "amount": 2500,
  "currency": "usd",
  "service": "Web Development",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "metadata": {
    "customField": "value"
  }
}
```

**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_xxx",
  "orderId": 123,
  "amount": 2500,
  "currency": "usd"
}
```

**Notes**:
- `amount` is in cents (2500 = $25.00)
- `clientSecret` is used in mobile app to confirm payment
- `orderId` can be used to track order status

### 2. Get Order Status

**Endpoint**: `GET /payment/order/:id`

**Description**: Retrieves order details and payment status.

**Example**: `GET /payment/order/123`

**Response**:
```json
{
  "success": true,
  "order": {
    "id": 123,
    "amount": 2500,
    "currency": "usd",
    "service": "Web Development",
    "status": "succeeded",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "receiptUrl": "https://pay.stripe.com/receipts/...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:31:00.000Z"
  }
}
```

**Status Values**:
- `pending` - Payment created but not completed
- `processing` - Payment is being processed
- `succeeded` - Payment completed successfully
- `failed` - Payment failed
- `canceled` - Payment canceled by user
- `refunded` - Payment refunded

### 3. Confirm Payment (Optional)

**Endpoint**: `POST /payment/confirm`

**Description**: Manually confirm a payment intent (usually handled by Stripe SDK in mobile app).

**Request Body**:
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response**:
```json
{
  "success": true,
  "status": "succeeded",
  "paymentIntentId": "pi_xxx"
}
```

### 4. Webhook Endpoint

**Endpoint**: `POST /payment/webhook`

**Description**: Receives webhook events from Stripe (configured in Stripe dashboard).

**Note**: This endpoint is called automatically by Stripe, not by your app.

## React Native Integration

### Installation

```bash
npm install @stripe/stripe-react-native
```

### Setup

```javascript
// App.tsx or App.js
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  return (
    <StripeProvider publishableKey="pk_test_your_key_here">
      {/* Your app components */}
    </StripeProvider>
  );
}
```

### Example Payment Flow

```javascript
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';

function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const handlePayment = async () => {
    try {
      // 1. Create payment intent on backend
      const response = await axios.post(`${STRAPI_URL}/api/payment/create-intent`, {
        amount: 2500, // $25.00
        currency: 'usd',
        service: 'Web Development',
        customerEmail: 'customer@example.com',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
      });
      
      const { clientSecret, orderId } = response.data;
      
      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Helpables LLC',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          email: 'customer@example.com',
          name: 'John Doe',
        },
      });
      
      if (initError) {
        console.error('Init error:', initError);
        return;
      }
      
      // 3. Present payment sheet
      const { error: presentError } = await presentPaymentSheet();
      
      if (presentError) {
        console.error('Payment error:', presentError);
        return;
      }
      
      // 4. Payment successful - check order status
      const orderResponse = await axios.get(`${STRAPI_URL}/api/payment/order/${orderId}`);
      console.log('Order status:', orderResponse.data.order.status);
      
      // Show success message
      Alert.alert('Success', 'Payment completed!');
      
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };
  
  return (
    <Button title="Pay Now" onPress={handlePayment} />
  );
}
```

### Polling Order Status

If you need to poll for order status updates:

```javascript
const pollOrderStatus = async (orderId, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await axios.get(`${STRAPI_URL}/api/payment/order/${orderId}`);
    const { status } = response.data.order;
    
    if (status === 'succeeded') {
      return { success: true, order: response.data.order };
    }
    
    if (status === 'failed' || status === 'canceled') {
      return { success: false, order: response.data.order };
    }
    
    // Wait 2 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return { success: false, error: 'Timeout' };
};
```

## Testing

### Test Card Numbers

Use these test card numbers in your mobile app:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC will work.

### Testing Webhooks Locally

1. Install Stripe CLI:
   ```bash
   npm install -g stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local Strapi:
   ```bash
   stripe listen --forward-to localhost:1337/api/payment/webhook
   ```

4. Trigger test events:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

## Error Handling

### Common Errors

1. **Missing required fields**
   ```json
   {
     "statusCode": 400,
     "error": "Bad Request",
     "message": "Missing required fields: amount, service, customerEmail"
   }
   ```

2. **Payment failed**
   ```json
   {
     "success": false,
     "order": {
       "status": "failed",
       "errorMessage": "Your card was declined."
     }
   }
   ```

3. **Order not found**
   ```json
   {
     "statusCode": 404,
     "error": "Not Found",
     "message": "Order not found"
   }
   ```

## Security Best Practices

1. ✅ Never store `STRIPE_SECRET_KEY` in mobile app
2. ✅ Always use `STRIPE_PUBLISHABLE_KEY` in mobile app
3. ✅ Validate amounts on server-side
4. ✅ Use webhook events for order fulfillment
5. ✅ Implement idempotency keys for retries
6. ✅ Log all payment events for audit trail

## Support

- **Strapi CMS**: Contact your backend administrator
- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com/

## Additional Features

The payment service includes helper methods for:

- Refunds: `createRefund(paymentIntentId, amount)`
- Cancel payment: `cancelPaymentIntent(paymentIntentId)`
- Customer management: `getCustomerByEmail(email)`
- Payment methods: `getPaymentMethods(customerId)`
- Order statistics: `getOrderStats(filters)`

These can be exposed as additional API endpoints as needed.
