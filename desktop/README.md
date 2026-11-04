# Crimson Vigil Windows build
Run the GitHub Actions workflow **Windows release candidate** to produce a downloadable Windows NSIS installer artifact. It bundles the existing game with Three.js r128 locally.

## Updating
The installed Windows game uses electron-updater to check GitHub Releases. Only **published, non-draft releases** are offered. Upload the full electron-builder output (installer .exe, .blockmap, latest.yml) to a GitHub Release for updates to work. The workflow publishes only when explicitly run with publish_release=true; the default is a test artifact.

## Important
Unsigned Windows builds may trigger SmartScreen. Code-signing and SteamPipe integration are needed before public Steam distribution. Never distribute an untested candidate as a production release.
