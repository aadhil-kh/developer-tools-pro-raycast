# Changelog

All notable changes to **Developer Tools Pro for Raycast** are documented here.

## [0.1.0] - 2026-06-07

### Added
- Graceful error handling: when Developer Tools Pro isn't installed (or hasn't registered the `devtpro://` scheme yet), the extension now shows a toast with a one-click link to the app's repository instead of silently failing.
- "Releasing to the Raycast Store" section in the README with the exact submission steps.
- "Troubleshooting" section in the README covering the most likely install/lint pitfalls.
- Placeholder "Screenshots" table in the README to fill in before store submission.
- Initial public commit: `Search Tools` command with 120+ tool entries, pin/unpin support, and clipboard-aware tool launch.
- `devtpro://` deep-link integration with macOS LaunchServices via Raycast's `open()` API.
- `generate-tools` script that reads `lib/features/shared/models/tool.dart` from the sibling Flutter project and produces `src/shared/tools.json`.

### Changed
- `author` and `owner` in `package.json` corrected to match the registered Raycast handle.
- Extension icon resized to the 512×512 PNG required by the Raycast Store.
- `.gitignore` now excludes nested `.DS_Store` files.
