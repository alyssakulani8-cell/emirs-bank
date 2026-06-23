param(
  [string]$ProjectDir = "C:\Users\Hp\emirs-bank\mobile"
)

Set-Location -LiteralPath $ProjectDir

# Get the Expo session from state.json
$statePath = Join-Path $env:USERPROFILE ".expo\state.json"
$state = Get-Content $statePath | ConvertFrom-Json
$session = $state.auth.sessionSecret

Write-Output "Starting EAS build with interactive input..."

# Create a temporary file with responses for the keystore prompt
# The prompt asks "Generate a new Android Keystore?" - we need to answer "y"
$tempScript = @"
`$env:CI = "`$null"
Set-Location -LiteralPath "$ProjectDir"
Write-Output "y" | npx eas build -p android --profile preview
"@

$tempPath = [System.IO.Path]::GetTempFileName() + ".ps1"
Set-Content -Path $tempPath -Value $tempScript -Encoding Ascii

Write-Output "Running build in new PowerShell process..."
Write-Output "Build may take 10-15 minutes..."
Write-Output ""

# Start the build in a new window so the user can see it
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$tempPath`""

Write-Output "Build started in a new PowerShell window."
Write-Output "Check that window for progress."
Write-Output ""
Write-Output "After build completes, the APK URL will be shown."
Write-Output "Run this to download it:"
Write-Output "   & curl.exe -L -b `"expo-session=$session`" -o AmerisGlobal.apk `"<APK_URL>`""
