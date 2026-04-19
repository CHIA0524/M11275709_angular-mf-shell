$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot

$source = Join-Path $repoRoot 'public\federation.manifest.prod.json'
$destination = Join-Path $repoRoot 'public\federation.manifest.json'

if (-not (Test-Path $source)) {
    throw "Missing production manifest: $source"
}

Copy-Item $source $destination -Force
Write-Host "Production manifest copied to $destination"