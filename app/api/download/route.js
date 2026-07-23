import { isAllowedMediaUrl } from "@/lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES = {
  mp4: "video/mp4",
  mp3: "audio/mpeg",
};

function safeFilename(name, fallbackExt) {
  const base = (name || "tiktoksave-video")
    .replace(/[^\w\-.]+/g, "_")
    .slice(0, 80);
  return base.endsWith(`.${fallbackExt}`) ? base : `${base}.${fallbackExt}`;
}

// NOTE: as of the last test, TikTok's video CDN returns 403 Forbidden to
// requests coming from Vercel's (and most cloud hosts') IP ranges — this is
// TikTok blocking known datacenter/hosting-provider traffic at the CDN
// edge, unrelated to anything in this code. Because of that, the UI
// (components/ResultCard.js) currently links users directly to TikTok's
// CDN instead of routing through this proxy, since a request from the
// user's own residential/mobile IP isn't blocked the same way.
//
// This route is kept in place because it still streams the file with a
// proper filename and Content-Disposition when it *can* reach the CDN
// (e.g. if you later put this behind a residential proxy service, or if
// TikTok's blocking changes) — see ResultCard.js if you want to switch
// back to it.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get("url");
  const type = searchParams.get("type") === "mp3" ? "mp3" : "mp4";
  const nameParam = searchParams.get("filename");

  if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
    // Logged so a rejected-but-legitimate TikTok CDN host is easy to spot
    // in Vercel's function logs and add to ALLOWED_MEDIA_HOST_SUFFIXES in
    // lib/tiktok.js, instead of guessing why downloads silently fail.
    if (mediaUrl) {
      try {
        console.error(
          `Rejected media host not in allowlist: ${new URL(mediaUrl).hostname}`
        );
      } catch {
        console.error("Rejected media URL was not a valid URL:", mediaUrl);
      }
    }
    return Response.json(
      { error: "That media URL isn't allowed." },
      { status: 400 }
    );
  }

  let upstream;
  try {
    upstream = await fetch(mediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        // TikTok's CDN checks these — without a matching Referer/Origin it
        // sometimes 403s a perfectly unexpired, valid link.
        Referer: "https://www.tiktok.com/",
        Origin: "https://www.tiktok.com",
        "Sec-Fetch-Dest": "video",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Upstream fetch threw:", err?.message || err);
    return Response.json(
      { error: "Couldn't reach the media file. Try again." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    // Logged so we can see TikTok's actual status/response instead of
    // guessing whether it's a real expiry, a missing header, or a block.
    let bodySnippet = "";
    try {
      bodySnippet = (await upstream.text()).slice(0, 300);
    } catch {
      // ignore — body may not be readable (e.g. already consumed)
    }
    console.error(
      `Upstream media fetch failed: status=${upstream.status} ${upstream.statusText} url=${mediaUrl} body=${bodySnippet}`
    );
    return Response.json(
      { error: "The media link expired. Paste the TikTok URL again." },
      { status: 502 }
    );
  }

  const filename = safeFilename(nameParam, type);

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPES[type],
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
