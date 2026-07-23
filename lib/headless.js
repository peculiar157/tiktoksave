// Headless-browser video capture — the harder fallback for when TikTok's
// CDN rejects plain HTTP requests (both from our server AND from a user's
// own browser opening the raw link, confirmed by testing) with a 403.
//
// The theory: TikTok's CDN sits behind Akamai's bot-protection, which
// appears to require proof that a real browser loaded an actual TikTok
// page and ran its JavaScript before it will serve the video file. A bare
// fetch — from anywhere — never does that, hence the 403 no matter what
// headers/referrer/IP we tried.
//
// The fix: launch a real (headless) Chromium browser on the server, have
// it load the actual TikTok video page (establishing whatever cookies/
// session validation Akamai wants), then trigger a fetch for the specific
// video URL *from inside that same browser page* — so the request carries
// the browser's real session and TLS fingerprint, not a synthetic one.
// We capture the response bytes via Chrome DevTools Protocol response
// interception rather than reading them back through page.evaluate, to
// avoid ferrying multi-MB base64 strings through the protocol.
//
// IMPORTANT CAVEATS (please read before assuming this "just works"):
// - This was written without the ability to test against real TikTok
//   pages (the sandbox this was built in has no network access to
//   tiktok.com at all), so treat this as a best-effort first attempt, not
//   a verified solution.
// - It's meaningfully slower than a plain download — expect several
//   seconds for the browser to boot and the page to load, on top of the
//   video transfer itself.
// - TikTok's video player may fetch video over multiple HTTP range
//   requests (partial chunks) rather than one full response. This code
//   grabs the *largest* matching response it sees within the capture
//   window as a practical heuristic; for longer videos split across many
//   ranges, this may only capture a partial file. Short-form TikTok clips
//   are usually small enough to come back as one response, but this is a
//   real limitation to know about if downloads come back truncated.
// - Headless Chromium can itself be detected and blocked by some bot
//   protection systems, independent of everything above.

import { isAllowedMediaUrl } from "./tiktok.js";

const CHROMIUM_VERSION = "149.0.0";
const CHROMIUM_PACK_URL = `https://github.com/Sparticuz/chromium/releases/download/v${CHROMIUM_VERSION}/chromium-v${CHROMIUM_VERSION}-pack.x64.tar`;

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export class HeadlessCaptureError extends Error {}

export async function captureTikTokMedia({ pageUrl, targetUrl, timeoutMs = 45000 }) {
  if (!targetUrl || !isAllowedMediaUrl(targetUrl)) {
    throw new HeadlessCaptureError("Target media URL isn't allowed.");
  }

  // These are only imported when this function actually runs, so a build
  // never fails even if one of these packages has trouble resolving in a
  // given environment.
  const { default: chromium } = await import("@sparticuz/chromium-min");
  const { default: puppeteer } = await import("puppeteer-core");

  chromium.setGraphicsMode = false;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(DESKTOP_USER_AGENT);
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    let best = null; // { buffer, contentType, length }

    page.on("response", async (response) => {
      try {
        const url = response.url();
        if (!isAllowedMediaUrl(url)) return;

        const headers = response.headers();
        const contentType = headers["content-type"] || "";
        if (!contentType.startsWith("video") && !contentType.startsWith("audio")) {
          return;
        }

        const buffer = await response.buffer();
        if (!best || buffer.length > best.length) {
          best = { buffer, contentType, length: buffer.length };
        }
      } catch {
        // Individual response bodies can fail to read (e.g. redirected,
        // already consumed) — safe to ignore and keep whatever we already
        // captured.
      }
    });

    await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: timeoutMs });

    // Trigger the specific quality/URL we actually want, from inside the
    // page's own JS context, so it carries the page's real session/cookies
    // and browser fingerprint rather than a synthetic Node-side request.
    await page
      .evaluate(async (url) => {
        try {
          await fetch(url, { credentials: "include" });
        } catch {
          // Swallow in-page fetch errors — the response listener above
          // may have already captured a usable response from the page's
          // own natural playback loading, even if this explicit fetch
          // fails.
        }
      }, targetUrl)
      .catch(() => {});

    // Give in-flight responses a moment to finish after that fetch.
    await new Promise((resolve) => setTimeout(resolve, 2500));

    if (!best) {
      throw new HeadlessCaptureError(
        "Loaded the TikTok page but never saw a matching video/audio response — TikTok may have changed how it serves media, or the page failed to load the video."
      );
    }

    return best;
  } finally {
    await browser.close().catch(() => {});
  }
}
