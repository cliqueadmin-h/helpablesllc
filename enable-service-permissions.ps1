# PowerShell script to enable service permissions
$STRAPI_URL = "https://helpablesllc-production.up.railway.app"

Write-Host "`n🔐 Strapi Admin Login" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$email = Read-Host "Enter admin email"
$securePassword = Read-Host "Enter admin password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Set environment variables
$env:ADMIN_EMAIL = $email
$env:ADMIN_PASSWORD = $password

Write-Host "`n🚀 Enabling service permissions...`n" -ForegroundColor Green

# Run the Node.js script
node enable-service-permissions.js

# Clear sensitive data
$env:ADMIN_PASSWORD = ""
$password = ""
