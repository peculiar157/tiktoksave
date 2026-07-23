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

// Streams the actual media file through our own server instead of sending
// the user straight to TikTok's CDN link. This is what makes the "Save"
// button behave like a real download (correct filename, no CORS surprises,
// no relying on the link staying valid) rather than opening TikTok's raw
// file in a new tab.
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
        Referer: "https://www.tiktok.com/",
      },
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Couldn't reach the media file. Try again." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
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
