# Enable Email Plugin Send Permission Script
# This script enables the "send" action for the email plugin in Strapi

Write-Host "🔧 Enable Email Plugin Send Permission" -ForegroundColor Cyan
Write-Host ""

# Securely get Railway URL
$railwayUrl = Read-Host "Enter Railway URL (press Enter for default: https://helpablesllc-production.up.railway.app)"
if ([string]::IsNullOrWhiteSpace($railwayUrl)) {
    $railwayUrl = "https://helpablesllc-production.up.railway.app"
}

# Securely get admin credentials
$adminEmail = Read-Host "Enter admin email"
$adminPasswordSecure = Read-Host "Enter admin password" -AsSecureString
$adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPasswordSecure))

Write-Host ""
Write-Host "Running permission update script..." -ForegroundColor Yellow

# Run the Node.js script with the credentials
$env:RAILWAY_URL = $railwayUrl
$env:ADMIN_EMAIL = $adminEmail
$env:ADMIN_PASSWORD = $adminPassword

node enable-email-permission.js

# Clear sensitive environment variables
Remove-Item Env:\ADMIN_EMAIL -ErrorAction SilentlyContinue
Remove-Item Env:\ADMIN_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:\RAILWAY_URL -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Script completed" -ForegroundColor Green
