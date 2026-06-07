/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Flutter App Path - Absolute path to the local Flutter project that contains `lib/features/shared/models/tool.dart`. Used by `npm run generate-tools` to refresh the tool index. Defaults to a sibling directory. */
  "flutterAppPath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `open-tool` command */
  export type OpenTool = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `open-tool` command */
  export type OpenTool = {}
}

