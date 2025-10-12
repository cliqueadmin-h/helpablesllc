# PowerShell script to check services
Write-Host "`n🔐 Strapi Admin Login" -ForegroundColor Cyan

$email = Read-Host "Enter admin email"
$securePassword = Read-Host "Enter admin password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

$env:ADMIN_EMAIL = $email
$env:ADMIN_PASSWORD = $password

Write-Host "`n🔍 Checking services...`n" -ForegroundColor Green
node check-services.js

$env:ADMIN_PASSWORD = ""
$password = ""
