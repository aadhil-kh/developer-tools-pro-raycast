# Internal maintainer notes

This repository is public solely to distribute the Raycast extension for the proprietary Developer Tools Pro macOS app. Do not add the app's source code, private paths, credentials, or other non-public product material to this repository or its public-facing documentation.

## Public-release boundary

- Keep the root `README.md` limited to installation, use, and end-user troubleshooting.
- Treat `src/shared/tools.json` as the published, checked-in tool index. Public builds must work without a local Flutter checkout.
- Keep source-sync instructions, deep-link verification, and Raycast Store submission notes in this file rather than in the root README.

## Commands

For a public-release check:

```bash
npm install
npm run lint
npm run build
```

The following command requires authorized access to the private Developer Tools Pro Flutter project:

```bash
# Refresh the checked-in tool index from the Flutter app.
npm run generate-tools

# Or provide the app location explicitly.
node scripts/generate-tools.mjs --flutter-app /path/to/developer-tools-pro
```

After refreshing the index, inspect and commit the resulting `src/shared/tools.json` change, then run the public-release checks above.

## Tool-index source

`scripts/generate-tools.mjs` reads these private-app files:

- `lib/routing/app_routes.dart`
- `lib/features/shared/models/tool.dart`

It resolves the Flutter project path in this order: the `--flutter-app` option, `FLUTTER_APP_PATH`, then the legacy sibling path `../flutter_application_1`. The generated index contains only the metadata needed by the extension: tool names, categories, routes, deep links, descriptions, input support, icons, and keywords.

## Deep-link checks

With Developer Tools Pro installed and launched at least once, verify representative links before releasing:

```bash
open devtpro://formatters/json
open "devtpro://encoders_decoders/base64/encode?input=hello%20world"
```

The extension opens links using the `devtpro` scheme and the `dev.aadhil.developer_tools_pro` bundle identifier. The app must continue to handle those links through its deep-link router.

## Raycast Store release

1. Confirm `npm run lint` and `npm run build` pass.
2. Confirm the extension metadata in `package.json` has the correct Raycast author and owner.
3. Add current screenshots or an animation showing search, action, and the deep-link flow.
4. Run `ray login`, then `ray store submit` from the repository root.
5. Address any review feedback in the Raycast extensions pull request.
