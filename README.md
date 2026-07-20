# Developer Tools Pro for Raycast

Launch Developer Tools Pro tools directly from Raycast. This extension is a public integration for the proprietary Developer Tools Pro macOS app; the app itself and its source code are not included here.

> **Not yet on the Raycast Store.** Install from this repository for now. Once the extension is approved, it will be available through [raycast.com](https://www.raycast.com).

## Install

### Before you start

- Install Developer Tools Pro and open it once. This registers its `devtpro://` URL scheme with macOS.
- Install [Raycast](https://www.raycast.com/) v1 (1.104.16 or later) or Raycast 2.0.
- Install [Node.js](https://nodejs.org/) 18 or later.

### From this repository

```bash
git clone https://github.com/aadhil-kh/developer-tools-pro-raycast.git
cd developer-tools-pro-raycast
npm install
npm run build
```

In Raycast, open **Extensions → Add Extension → Import Extension**, select the `developer-tools-pro-raycast` folder, and confirm.

The **Search Tools** command will then appear in Raycast. Search for a Developer Tools Pro tool and press <kbd>Enter</kbd> to open it.

> The extension includes its published tool index. You do not need access to the Developer Tools Pro source code or need to run `npm run generate-tools`.

## Update

```bash
cd developer-tools-pro-raycast
git pull
npm install
npm run build
```

Restart Raycast if it does not pick up the update automatically.

## What it does

| Command | Description |
| --- | --- |
| **Search Tools** | Search and launch Developer Tools Pro tools. |

The command accepts optional input. With no input, it uses your clipboard when the selected tool supports it, so selected text can be sent straight to a tool.

## Troubleshooting

### “Developer Tools Pro not installed”

Install Developer Tools Pro and open it at least once, then try again. Opening the app lets macOS register the `devtpro://` link used by this extension.

### Raycast cannot import the extension

Run `npm run build` again from the repository folder, then retry the import. Make sure you are using a supported version of Raycast and Node.js.

## License

[MIT](LICENSE)
