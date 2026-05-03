$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$sourceManifest = Join-Path $repoRoot 'public/federation.manifest.prod.json'
$targetManifest = Join-Path $repoRoot 'public/federation.manifest.json'

if (-not (Test-Path $sourceManifest)) {
    throw "Production federation manifest not found: $sourceManifest"
}

Copy-Item -Path $sourceManifest -Destination $targetManifest -Force
Write-Host "Applied production federation manifest to $targetManifest"