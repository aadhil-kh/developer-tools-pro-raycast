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
 * Public GitHub repository for Developer Tools Pro. Linked from error toasts
 * when the app isn't installed so the user can install it.
 */
export const APP_REPO_URL = "https://github.com/aadhil-kh/developer-tools-pro";

/**
 * Result of {@link openInApp}. If the launch failed, `ok` is `false` and the
 * caller can surface a helpful toast.
 */
export type OpenResult = { ok: true } | { ok: false; reason: "not-installed" | "unknown"; error?: unknown };

/**
 * Open a `devtpro://` deep link in Developer Tools Pro using Raycast's
 * built-in `open` utility. Raycast handles window focus correctly and,
 * when `APP_BUNDLE_ID` is passed, ensures the URL is routed to our app
 * even if another app has registered the `devtpro://` scheme.
 *
 * Resolves to an {@link OpenResult} instead of throwing so callers can render
 * friendly toasts. The previous behavior (returning `open()`'s promise)
 * swallowed errors silently.
 *
 * @param deepLink - Full URL string, e.g. "devtpro://formatters/json?input=...".
 */
export async function openInApp(deepLink: string): Promise<OpenResult> {
  try {
    await open(deepLink, APP_BUNDLE_ID);
    return { ok: true };
  } catch (e) {
    // Raycast's `open()` rejects when LaunchServices can't find an app for
    // the bundle id — which in practice means the app isn't installed
    // (or the URL scheme hasn't been registered yet because the user hasn't
    // launched the app at least once).
    const message = e instanceof Error ? e.message : String(e);
    const lower = message.toLowerCase();
    const looksMissing =
      lower.includes("not found") ||
      lower.includes("no application") ||
      lower.includes("could not find") ||
      lower.includes("couldn't be found") ||
      lower.includes("not installed");
    return { ok: false, reason: looksMissing ? "not-installed" : "unknown", error: e };
  }
}

/**
 * URL-encode a value for use in a deep-link query parameter. Uses the standard
 * `encodeURIComponent` but also encodes `'` for safety since some shells
 * interpret it.
 */
export function encodeInput(input: string): string {
  return encodeURIComponent(input);
}
