# Test Automation API on Railway
# This script tests the n8n automation endpoints

$baseUrl = "https://helpablesllc-production.up.railway.app"

Write-Host "=== Testing Automation API ===" -ForegroundColor Cyan
Write-Host ""

# First, we need to get a JWT token by logging in
Write-Host "Step 1: Logging in to get JWT token..." -ForegroundColor Yellow

$loginBody = @{
    identifier = "admin@helpables.io"  # Change this to your test user
    password = "Test1234!"              # Change this to your test password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/local" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.jwt
    Write-Host "✓ Login successful! JWT token obtained." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please update the credentials in this script with valid Strapi user credentials." -ForegroundColor Yellow
    exit 1
}

# Test 1: Trigger signup automation
Write-Host "Step 2: Testing trigger-signup endpoint..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$signupBody = @{
    additionalData = "Test signup automation from PowerShell"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/api/automation/trigger-signup" -Method Post -Headers $headers -Body $signupBody
    Write-Host "✓ Signup automation response:" -ForegroundColor Green
    Write-Host ($signupResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Signup automation failed:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode.value__ -eq 500) {
        Write-Host ""
        Write-Host "This error likely means:" -ForegroundColor Yellow
        Write-Host "1. N8N_WEBHOOK_URL or N8N_API_KEY environment variables are not set in Railway" -ForegroundColor Yellow
        Write-Host "2. n8n webhook is not configured or not accessible" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Test 2: Trigger general workflow
Write-Host "Step 3: Testing trigger-workflow endpoint..." -ForegroundColor Yellow

$workflowBody = @{
    workflowName = "test-workflow"
    workflowData = @{
        testField = "Test data"
        timestamp = (Get-Date).ToString("o")
    }
} | ConvertTo-Json

try {
    $workflowResponse = Invoke-RestMethod -Uri "$baseUrl/api/automation/trigger" -Method Post -Headers $headers -Body $workflowBody
    Write-Host "✓ Workflow automation response:" -ForegroundColor Green
    Write-Host ($workflowResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Workflow automation failed:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode.value__ -eq 500) {
        Write-Host ""
        Write-Host "This error likely means:" -ForegroundColor Yellow
        Write-Host "1. N8N_WEBHOOK_URL or N8N_API_KEY environment variables are not set in Railway" -ForegroundColor Yellow
        Write-Host "2. n8n webhook is not configured or not accessible" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: If tests fail with 500 errors, you need to:" -ForegroundColor Yellow
Write-Host "1. Configure n8n webhook and get the webhook URL" -ForegroundColor Yellow
Write-Host "2. Add N8N_WEBHOOK_URL environment variable to Railway" -ForegroundColor Yellow
Write-Host "3. Add N8N_API_KEY environment variable to Railway" -ForegroundColor Yellow
Write-Host "4. Redeploy the service on Railway" -ForegroundColor Yellow
