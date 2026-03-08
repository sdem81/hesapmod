[CmdletBinding()]
param(
  [int]$Port = 8082,
  [string]$AvdName = "HesapModApi35",
  [string]$SystemImage = "system-images;android-35;google_apis;x86_64",
  [switch]$Clear
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Step {
  param([string]$Message)
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-NodeVersion {
  param([string]$NodePath)

  if (-not $NodePath -or -not (Test-Path $NodePath)) {
    return $null
  }

  try {
    $rawVersion = (& $NodePath -v).Trim()
    if (-not $rawVersion) {
      return $null
    }

    return [version]$rawVersion.TrimStart("v")
  } catch {
    return $null
  }
}

function Resolve-CompatibleNode {
  param([version]$MinimumVersion)

  $candidatePaths = @(
    "C:\Tools\node-v20.20.1-win-x64\node.exe"
    (Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue)
    (Join-Path $env:ProgramFiles "nodejs\node.exe")
  ) | Where-Object { $_ } | Select-Object -Unique

  foreach ($candidatePath in $candidatePaths) {
    $version = Get-NodeVersion -NodePath $candidatePath
    if ($version -and $version -ge $MinimumVersion) {
      return $candidatePath
    }
  }

  $targetVersion = "v20.20.1"
  $toolsRoot = "C:\Tools"
  $archivePath = Join-Path $toolsRoot "node-$targetVersion-win-x64.zip"
  $extractRoot = Join-Path $toolsRoot "node-$targetVersion-win-x64"
  $portableNode = Join-Path $extractRoot "node.exe"

  if (-not (Test-Path $portableNode)) {
    Write-Step "Compatible Node bulunamadi. Portable Node $targetVersion indiriliyor"
    New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null

    if (-not (Test-Path $archivePath)) {
      Invoke-WebRequest -UseBasicParsing "https://nodejs.org/dist/$targetVersion/node-$targetVersion-win-x64.zip" -OutFile $archivePath
    }

    if (-not (Test-Path $extractRoot)) {
      Expand-Archive -Path $archivePath -DestinationPath $toolsRoot -Force
    }
  }

  $portableVersion = Get-NodeVersion -NodePath $portableNode
  if (-not $portableVersion -or $portableVersion -lt $MinimumVersion) {
    throw "Uygun bir Node kurulumu bulunamadi. Beklenen minimum surum: $MinimumVersion"
  }

  return $portableNode
}

function Resolve-AndroidSdkRoot {
  $candidates = @(
    $env:ANDROID_SDK_ROOT
    $env:ANDROID_HOME
    (Join-Path $env:LOCALAPPDATA "Android\Sdk")
  ) | Where-Object { $_ } | Select-Object -Unique

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "Android SDK bulunamadi. Android Studio/SDK kurulumu gerekli."
}

function Get-SystemImagePath {
  param(
    [string]$SdkRoot,
    [string]$PackageName
  )

  $parts = $PackageName.Split(";")
  if ($parts.Length -ne 4 -or $parts[0] -ne "system-images") {
    throw "Beklenmeyen system image paketi: $PackageName"
  }

  return (Join-Path $SdkRoot (Join-Path "system-images" (Join-Path $parts[1] (Join-Path $parts[2] $parts[3]))))
}

function Get-AdbDevices {
  param([string]$AdbPath)

  $deviceLines = (& $AdbPath devices) | Select-Object -Skip 1
  $devices = @()

  foreach ($line in $deviceLines) {
    $trimmed = $line.Trim()
    if (-not $trimmed) {
      continue
    }

    $parts = $trimmed -split "\s+"
    if ($parts.Length -lt 2) {
      continue
    }

    $devices += [pscustomobject]@{
      Serial = $parts[0]
      State = $parts[1]
    }
  }

  return $devices
}

function Wait-ForEmulatorBoot {
  param(
    [string]$AdbPath,
    [string]$Serial,
    [int]$TimeoutSeconds = 240
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    $state = ""
    try {
      $state = (& $AdbPath -s $Serial get-state 2>$null).Trim()
    } catch {
      $state = ""
    }

    if ($state -eq "device") {
      try {
        $bootCompleted = (& $AdbPath -s $Serial shell getprop sys.boot_completed 2>$null).Trim()
      } catch {
        $bootCompleted = ""
      }

      if ($bootCompleted -eq "1") {
        return
      }
    }

    Start-Sleep -Seconds 5
  }

  throw "Emulator $Serial beklenen surede boot olmadi."
}

function Ensure-Directory {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

$minimumNodeVersion = [version]"20.19.4"
$scriptDir = Split-Path -Parent $PSCommandPath
$mobileRoot = Split-Path -Parent $scriptDir
$nodePath = Resolve-CompatibleNode -MinimumVersion $minimumNodeVersion
$nodeDir = Split-Path -Parent $nodePath

Write-Step "Node secildi: $nodePath"

$androidSdkRoot = Resolve-AndroidSdkRoot
$androidRoot = "C:\Android"
$androidSdkAlias = Join-Path $androidRoot "Sdk"
$androidHome = Join-Path $androidRoot "home"
$androidUserHome = Join-Path $androidHome ".android"
$androidAvdHome = Join-Path $androidUserHome "avd"
$androidTemp = Join-Path $androidRoot "tmp"

Ensure-Directory -Path $androidRoot
if (-not (Test-Path $androidSdkAlias)) {
  Write-Step "ASCII Android SDK alias'i olusturuluyor: $androidSdkAlias"
  New-Item -ItemType Junction -Path $androidSdkAlias -Target $androidSdkRoot | Out-Null
}

Ensure-Directory -Path $androidHome
Ensure-Directory -Path $androidUserHome
Ensure-Directory -Path $androidAvdHome
Ensure-Directory -Path $androidTemp

$env:ANDROID_HOME = $androidSdkAlias
$env:ANDROID_SDK_ROOT = $androidSdkAlias
$env:ANDROID_SDK_HOME = $androidHome
$env:ANDROID_USER_HOME = $androidUserHome
$env:ANDROID_EMULATOR_HOME = $androidUserHome
$env:ANDROID_AVD_HOME = $androidAvdHome
$env:HOME = $androidHome
$env:USERPROFILE = $androidHome
$env:TMP = $androidTemp
$env:TEMP = $androidTemp
$env:PATH = "$nodeDir;$androidSdkAlias\platform-tools;$androidSdkAlias\emulator;$env:PATH"

$sdkManager = Join-Path $androidSdkAlias "cmdline-tools\latest\bin\sdkmanager.bat"
$avdManager = Join-Path $androidSdkAlias "cmdline-tools\latest\bin\avdmanager.bat"
$emulatorExe = Join-Path $androidSdkAlias "emulator\emulator.exe"
$adbExe = Join-Path $androidSdkAlias "platform-tools\adb.exe"
$expoCli = Join-Path $mobileRoot "node_modules\expo\bin\cli"
$systemImagePath = Get-SystemImagePath -SdkRoot $androidSdkAlias -PackageName $SystemImage
$avdPath = Join-Path $androidAvdHome "$AvdName.avd"

foreach ($requiredPath in @($sdkManager, $avdManager, $emulatorExe, $adbExe, $expoCli)) {
  if (-not (Test-Path $requiredPath)) {
    throw "Gerekli arac bulunamadi: $requiredPath"
  }
}

if (-not (Test-Path $systemImagePath)) {
  Write-Step "Eksik Android system image indiriliyor: $SystemImage"
  & $sdkManager $SystemImage
}

if (-not (Test-Path $avdPath)) {
  Write-Step "AVD olusturuluyor: $AvdName"
  "no" | & $avdManager create avd -n $AvdName -k $SystemImage -d medium_phone --force
}

Write-Step "ADB sunucusu baslatiliyor"
& $adbExe start-server | Out-Null

$existingReadyEmulator = Get-AdbDevices -AdbPath $adbExe | Where-Object {
  $_.Serial -like "emulator-*" -and $_.State -eq "device"
} | Select-Object -First 1

if ($existingReadyEmulator) {
  $selectedSerial = $existingReadyEmulator.Serial
  Write-Step "Hazir emulator bulundu: $selectedSerial"
} else {
  $knownEmulators = Get-AdbDevices -AdbPath $adbExe | Where-Object { $_.Serial -like "emulator-*" } | Select-Object -ExpandProperty Serial
  Write-Step "Emulator baslatiliyor: $AvdName"
  Start-Process -FilePath $emulatorExe -ArgumentList @("-avd", $AvdName, "-no-snapshot-load", "-gpu", "swiftshader_indirect") | Out-Null

  $deadline = (Get-Date).AddMinutes(4)
  $selectedSerial = $null

  while ((Get-Date) -lt $deadline -and -not $selectedSerial) {
    Start-Sleep -Seconds 5
    $currentEmulators = Get-AdbDevices -AdbPath $adbExe | Where-Object {
      $_.Serial -like "emulator-*" -and $_.State -eq "device"
    }

    $newEmulator = $currentEmulators | Where-Object { $_.Serial -notin $knownEmulators } | Select-Object -First 1
    if ($newEmulator) {
      $selectedSerial = $newEmulator.Serial
      break
    }

    $selectedSerial = $currentEmulators | Select-Object -First 1 -ExpandProperty Serial
  }

  if (-not $selectedSerial) {
    throw "Baslatilan emulator adb tarafinda gorunmedi."
  }
}

Write-Step "Emulator boot bekleniyor: $selectedSerial"
Wait-ForEmulatorBoot -AdbPath $adbExe -Serial $selectedSerial

try {
  & $adbExe -s $selectedSerial shell input keyevent 82 | Out-Null
} catch {
}

$hostMode = "lan"
$localLanAddress = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
  $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254*" -and $_.PrefixOrigin -ne "WellKnown"
} | Select-Object -First 1 -ExpandProperty IPAddress

if (-not $localLanAddress) {
  $hostMode = "localhost"
}

$expoArgs = @(
  $expoCli
  "start"
  "--android"
  "--port"
  $Port
)

if ($hostMode -eq "lan") {
  $expoArgs += "--lan"
} else {
  Write-Step "LAN IP bulunamadi. localhost moduna dusuluyor"
  $expoArgs += "--localhost"
}

if ($Clear) {
  $expoArgs += "--clear"
}

Write-Step "Expo Android akisi baslatiliyor ($hostMode, port $Port)"
Push-Location $mobileRoot
try {
  & $nodePath @expoArgs
} finally {
  Pop-Location
}
