# PowerShell script to enable contact form permissions
Write-Host "`n🔓 Enable Contact Form Permissions" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$email = Read-Host "Enter admin email"
$securePassword = Read-Host "Enter admin password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

$env:ADMIN_EMAIL = $email
$env:ADMIN_PASSWORD = $password

Write-Host "`n🚀 Running script...`n" -ForegroundColor Green
node enable-contact-permissions.js

$env:ADMIN_PASSWORD = ""
$password = ""
