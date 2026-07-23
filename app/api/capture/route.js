import { extractTikTokUrl, isAllowedMediaUrl } from "@/lib/tiktok";
import { captureTikTokMedia, HeadlessCaptureError } from "@/lib/headless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Ask Vercel for as much time as the plan allows — headless browser boot +
// page load + video transfer can genuinely take a while. On plans/limits
// below 60s this will just get cut short with a timeout error, which is a
// real constraint of doing this on a free tier, not a bug.
export const maxDuration = 60;

function safeFilename(name, fallbackExt) {
  const base = (name || "tiktoksave-video")
    .replace(/[^\w\-.]+/g, "_")
    .slice(0, 80);
  return base.endsWith(`.${fallbackExt}`) ? base : `${base}.${fallbackExt}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageUrlParam = searchParams.get("pageUrl");
  const targetUrl = searchParams.get("targetUrl");
  const nameParam = searchParams.get("filename");

  const pageUrl = extractTikTokUrl(pageUrlParam || "");
  if (!pageUrl) {
    return Response.json(
      { error: "Missing or invalid TikTok page URL." },
      { status: 400 }
    );
  }

  if (!targetUrl || !isAllowedMediaUrl(targetUrl)) {
    return Response.json(
      { error: "Missing or invalid target media URL." },
      { status: 400 }
    );
  }

  try {
    const { buffer, contentType } = await captureTikTokMedia({
      pageUrl,
      targetUrl,
    });

    const filename = safeFilename(nameParam, "mp4");

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof HeadlessCaptureError) {
      console.error("Headless capture failed (expected error):", err.message);
      return Response.json({ error: err.message }, { status: 502 });
    }

    console.error("Headless capture threw unexpectedly:", err?.message || err);
    return Response.json(
      {
        error:
          "The headless capture crashed unexpectedly. Check Vercel's function logs for details.",
      },
      { status: 500 }
    );
  }
}
