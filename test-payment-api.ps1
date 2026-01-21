# Stripe Payment API Test Script
# Replace with your actual Stripe publishable key after testing

$STRAPI_URL = "https://helpablesllc-production.up.railway.app"

Write-Host "🧪 Testing Stripe Payment API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Create Payment Intent
Write-Host "Test 1: Creating Payment Intent..." -ForegroundColor Yellow
$body = @{
    amount = 2500
    currency = "usd"
    service = "Web Development Test"
    customerEmail = "test@example.com"
    customerName = "Test User"
    customerPhone = "+1234567890"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$STRAPI_URL/api/payment/create-intent" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "✅ Payment Intent Created Successfully!" -ForegroundColor Green
    Write-Host "   Order ID: $($response.orderId)" -ForegroundColor White
    Write-Host "   Payment Intent ID: $($response.paymentIntentId)" -ForegroundColor White
    Write-Host "   Amount: `$$($response.amount / 100)" -ForegroundColor White
    Write-Host "   Client Secret: $($response.clientSecret.Substring(0, 20))..." -ForegroundColor White
    Write-Host ""
    
    $orderId = $response.orderId
    
    # Test 2: Get Order Status
    Write-Host "Test 2: Fetching Order Status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    
    $orderResponse = Invoke-RestMethod -Uri "$STRAPI_URL/api/payment/order/$orderId" -Method GET
    
    Write-Host "✅ Order Retrieved Successfully!" -ForegroundColor Green
    Write-Host "   Status: $($orderResponse.order.status)" -ForegroundColor White
    Write-Host "   Service: $($orderResponse.order.service)" -ForegroundColor White
    Write-Host "   Customer: $($orderResponse.order.customerName) ($($orderResponse.order.customerEmail))" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎉 All API Tests Passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Check Strapi Admin Panel at: $STRAPI_URL/admin" -ForegroundColor White
    Write-Host "2. Look for the new Order in Content Manager" -ForegroundColor White
    Write-Host "3. To test actual payment, use the test-payment.html file" -ForegroundColor White
    
} catch {
    Write-Host "❌ API Test Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible Issues:" -ForegroundColor Yellow
    Write-Host "- Strapi is still deploying (check Railway)" -ForegroundColor White
    Write-Host "- STRIPE_SECRET_KEY not set in Railway" -ForegroundColor White
    Write-Host "- API endpoint URL is incorrect" -ForegroundColor White
}
