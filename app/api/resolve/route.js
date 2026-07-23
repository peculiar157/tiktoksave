import { resolveTikTokVideo, TikTokResolveError } from "@/lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Send a JSON body like { \"url\": \"...\" }." },
      { status: 400 }
    );
  }

  const url = typeof body?.url === "string" ? body.url : "";

  if (!url.trim()) {
    return Response.json(
      { error: "Paste a TikTok video link first." },
      { status: 400 }
    );
  }

  try {
    const video = await resolveTikTokVideo(url);
    return Response.json({ video }, { status: 200 });
  } catch (err) {
    if (err instanceof TikTokResolveError) {
      return Response.json({ error: err.message }, { status: 422 });
    }

    console.error("resolve error:", err);
    return Response.json(
      {
        error:
          "Something went wrong reaching TikTok. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
