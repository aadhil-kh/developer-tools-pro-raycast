import { open } from "@raycast/api";

/**
 * The macOS bundle identifier of Developer Tools Pro. Passing this as the
 * second argument to `open()` makes Raycast explicitly hand the URL to our
 * app even if another app has registered the `devtpro://` scheme.
 *
 * Keep in sync with `PRODUCT_BUNDLE_IDENTIFIER` in
 * `macos/Runner/Configs/AppInfo.xcconfig`.
 */
export const APP_BUNDLE_ID = "dev.aadhil.developer_tools_pro";

/**
 * Open a `devtpro://` deep link in Developer Tools Pro using Raycast's
 * built-in `open` utility. Raycast handles window focus correctly and,
 * when `APP_BUNDLE_ID` is passed, ensures the URL is routed to our app
 * even if another app has registered the `devtpro://` scheme.
 *
 * Returns the Promise from `open()` so callers can `await` it before
 * showing toasts or popping navigation stacks.
 *
 * @param deepLink - Full URL string, e.g. "devtpro://formatters/json?input=...".
 */
export function openInApp(deepLink: string): Promise<void> {
  return open(deepLink, APP_BUNDLE_ID);
}

/**
 * URL-encode a value for use in a deep-link query parameter. Uses the standard
 * `encodeURIComponent` but also encodes `'` for safety since some shells
 * interpret it.
 */
export function encodeInput(input: string): string {
  return encodeURIComponent(input);
}
