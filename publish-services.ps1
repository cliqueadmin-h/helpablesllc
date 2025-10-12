# PowerShell script to publish services
Write-Host "`n📤 Publish Services to Public API" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$email = Read-Host "Enter admin email"
$securePassword = Read-Host "Enter admin password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

$env:ADMIN_EMAIL = $email
$env:ADMIN_PASSWORD = $password

Write-Host "`n🚀 Running publish script...`n" -ForegroundColor Green
node publish-services.js

$env:ADMIN_PASSWORD = ""
$password = ""

Write-Host "`n✨ Done! Your services should now be visible on the frontend." -ForegroundColor Green
