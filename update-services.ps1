# PowerShell script to update Strapi services
$STRAPI_URL = "https://helpablesllc-production.up.railway.app"

Write-Host "`n🔐 Strapi Admin Login" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$email = Read-Host "Enter admin email"
$securePassword = Read-Host "Enter admin password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Set environment variables
$env:ADMIN_EMAIL = $email
$env:ADMIN_PASSWORD = $password

Write-Host "`n🚀 Running update script...`n" -ForegroundColor Green

# Run the Node.js script
node update-services.js

# Clear sensitive data
$env:ADMIN_PASSWORD = ""
$password = ""
