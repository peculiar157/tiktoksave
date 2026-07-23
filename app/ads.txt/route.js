// Serves /ads.txt, required by AdSense once you're approved and monetizing.
// Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID (e.g. "pub-1234567890123456") in your
// environment and this fills itself in automatically. Until then it returns
// an empty file, which is harmless.

export const dynamic = "force-static";

export async function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "";

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
