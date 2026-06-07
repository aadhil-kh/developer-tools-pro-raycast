# Developer Tools Pro for Raycast

Browse and launch any of the 120+ tools in [Developer Tools Pro](https://github.com/aadhil-kh/developer-tools-pro) directly from Raycast — on both Raycast v1 (≥ 1.104.16) and Raycast 2.0.

## Commands

| Command | Description |
| --- | --- |
| **Open Tool** | Searchable list of every tool. Press <kbd>Enter</kbd> to open in Developer Tools Pro. |
| **Quick Format JSON** | Open JSON Formatter with selected text or clipboard pre-filled. |
| **Quick Base64 Encode** | Open Base64 Encoder with input pre-filled. |
| **Quick URL Encode** | Open URL Encoder with input pre-filled. |
| **Quick URL Decode** | Open URL Decoder with input pre-filled. |
| **Quick JWT Decode** | Open JWT Decoder with token pre-filled. |

The Quick Convert commands accept an optional `input` argument. If omitted, they fall back to your clipboard contents — so you can select text anywhere, hit your hotkey, and the tool opens with the text ready to go.

## How it works

```
Raycast ──open("devtpro://formatters/json?input=...")──▶ macOS LaunchServices
                                                              │
                                                              ▼
                                            Developer Tools Pro
                                                              │
                                              DeepLinkRouter.resolve(uri)
                                                              │
                                              Navigator.pushNamed(route)
                                                              │
                                              Screen.initState reads input
```

The extension calls `open("devtpro://...", "dev.aadhil.developer_tools_pro")`. The second argument tells Raycast to launch Developer Tools Pro specifically, even if another app has registered the `devtpro://` scheme.

## Requirements

- [Developer Tools Pro](https://github.com/aadhil-kh/developer-tools-pro) installed and launched at least once (so macOS registers the `devtpro://` URL scheme via LaunchServices).
- Raycast v1 (≥ 1.104.16) or Raycast 2.0 beta.
- The sibling Flutter project at `../flutter_application_1` (for the tool index generator). Override with the `FLUTTER_APP_PATH` env var or `--flutter-app` flag.

## Development

```bash
# Install dependencies
npm install

# Generate src/shared/tools.json from the Flutter app's tool.dart
npm run generate-tools

# Run in development mode (regenerates tools.json first)
npm run dev

# Build for distribution
npm run build

# Lint
npm run lint
```

### Keeping the tool list in sync

`tools.json` is regenerated from `lib/features/shared/models/tool.dart` every time you run `npm run dev` or `npm run build` (via the `prebuild` hook). To refresh it manually:

```bash
npm run generate-tools
# or with a custom Flutter app path:
node scripts/generate-tools.mjs --flutter-app /path/to/flutter_app
```

The file is gitignored — it's always derived from source.

### Testing deep links

After running the Flutter app at least once:

```bash
open devtpro://formatters/json
open "devtpro://encoders_decoders/base64/encode?input=hello%20world"
```

The first jumps to JSON Formatter; the second opens Base64 Encoder with "hello world" pre-filled.

## Screenshots

> Add three 1284×800 (or 2x) screenshots of the search list, pinned section, and Quick Convert before submitting to the Raycast Store. Reviewers strongly prefer an animated GIF or 3-frameStill PNG showing the search → action → deep-link flow.

| Search & Pin | Quick Convert | Tool input form |
| --- | --- | --- |
| _placeholder_ | _placeholder_ | _placeholder_ |

## Troubleshooting

**The "Open Tool" action shows "Developer Tools Pro not installed"**

The macOS app isn't installed, or hasn't been launched at least once so LaunchServices has registered the `devtpro://` URL scheme. Install [Developer Tools Pro](https://github.com/aadhil-kh/developer-tools-pro), launch it once, then try again.

**`npm run lint` reports `Invalid owner` or `Invalid author`**

The `author` and `owner` fields in `package.json` must match a registered Raycast user and organization. Sign in at [developers.raycast.com](https://developers.raycast.com), claim your handle, create an organization (if you haven't), then update `package.json` to match exactly.

**`tools.json` is missing**

Run `npm run generate-tools` (which reads from the sibling Flutter project) or `npm run build` (which does it for you via the `prebuild` hook).

## Releasing to the Raycast Store

1. Make sure `npm run lint` and `npm run build` both pass.
2. Push to a public GitHub repository.
3. Run `ray login` once (sign in with the same handle used in `package.json`).
4. Run `ray store submit` from the project root. This opens a PR against [raycast/extensions](https://github.com/raycast/extensions) for Raycast review.
5. Address any reviewer feedback on the PR. Approval typically takes 1–5 days.

For the latest guidelines see the official [Submitting an Extension](https://developers.raycast.com/basics/submit-an-extension) docs.

## License

MIT
