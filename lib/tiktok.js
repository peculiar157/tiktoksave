// Core "no paid API" TikTok resolver.
//
// How it works: TikTok's own public video pages embed a JSON blob (inside a
// <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"> tag) that the web app
// itself uses to render the page. That JSON already contains direct,
// unwatermarked CDN links for the video and its background audio track.
// We simply fetch the public page like a browser would and read that JSON
// out of the HTML - no TikTok developer account, no paid API, no login.
//
// Caveat: this depends on TikTok's page markup staying the same shape.
// TikTok changes this occasionally, which is why extraction lives in one
// place (this file) and fails loudly with a clear error instead of crashing
// the app when the shape changes.

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const TIKTOK_LINK_PATTERN =
  /https?:\/\/(?:www\.|vm\.|vt\.|m\.)?tiktok\.com\/[^\s"']+/i;

// Hostnames TikTok is known to serve media from. The download-proxy route
// only ever fetches URLs whose host ends with one of these, so this file's
// output can't be abused to turn the proxy into an open relay for
// arbitrary third-party URLs.
export const ALLOWED_MEDIA_HOST_SUFFIXES = [
  // TikTok's web app increasingly serves video/audio directly off
  // *.tiktok.com subdomains (e.g. v16-webapp-prime.tiktok.com), not just
  // the older tiktokcdn.com-style domains below — this one is important.
  "tiktok.com",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "tiktokcdn.us",
  "tiktokv.com",
  "tiktokv.us",
  "muscdn.com",
  "ibyteimg.com",
  "ibytedtos.com",
  "byteoversea.com",
  "bytefcdn.com",
  "bytefcdn-oversea.com",
  "akamaized.net",
];

export function isAllowedMediaUrl(rawUrl) {
  try {
    const { hostname, protocol } = new URL(rawUrl);
    if (protocol !== "https:") return false;
    return ALLOWED_MEDIA_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

export function extractTikTokUrl(input) {
  if (!input) return null;
  const match = input.trim().match(TIKTOK_LINK_PATTERN);
  return match ? match[0] : null;
}

function resolveUrlField(field) {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (Array.isArray(field.urlList) && field.urlList.length) {
    return field.urlList[0];
  }
  if (Array.isArray(field.UrlList) && field.UrlList.length) {
    return field.UrlList[0];
  }
  return null;
}

async function fetchTikTokHtml(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": DESKTOP_USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new TikTokResolveError(
      `TikTok responded with a ${res.status} while loading that link. The video may be private, deleted, or region-locked.`
    );
  }

  return res.text();
}

function extractRehydrationJson(html) {
  const scriptMatch = html.match(
    /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!scriptMatch) return null;

  try {
    return JSON.parse(scriptMatch[1]);
  } catch {
    return null;
  }
}

function findItemStruct(rehydrationData) {
  const scope = rehydrationData?.__DEFAULT_SCOPE__ ?? {};
  const detail =
    scope["webapp.video-detail"] ??
    scope["webapp.photo-detail"] ??
    scope["webapp.aweme-detail"];

  return detail?.itemInfo?.itemStruct ?? null;
}

function pickVideoRenditions(video) {
  const bitrateInfo = Array.isArray(video?.bitrateInfo)
    ? video.bitrateInfo
    : [];

  const renditions = bitrateInfo
    .map((entry) => ({
      label: entry?.GearName || "",
      bitrate: Number(entry?.Bitrate) || 0,
      url: resolveUrlField(entry?.PlayAddr),
    }))
    .filter((entry) => entry.url);

  renditions.sort((a, b) => b.bitrate - a.bitrate);
  return renditions;
}

export class TikTokResolveError extends Error {}

export async function resolveTikTokVideo(rawInput) {
  const link = extractTikTokUrl(rawInput);
  if (!link) {
    throw new TikTokResolveError(
      "That doesn't look like a TikTok link. Paste a full tiktok.com (or vm.tiktok.com / vt.tiktok.com) video URL."
    );
  }

  const html = await fetchTikTokHtml(link);
  const rehydrationData = extractRehydrationJson(html);
  const item = rehydrationData ? findItemStruct(rehydrationData) : null;

  if (!item) {
    throw new TikTokResolveError(
      "Couldn't read this video's data. It may be private, age-restricted, region-locked, or TikTok changed their page format."
    );
  }

  const video = item.video || {};
  const music = item.music || {};
  const author = item.author || {};
  const stats = item.stats || item.statsV2 || {};

  const renditions = pickVideoRenditions(video);
  const fallback = resolveUrlField(video.downloadAddr) || resolveUrlField(video.playAddr);

  const hdUrl = renditions[0]?.url || fallback;
  const standardUrl = renditions[renditions.length - 1]?.url || fallback;
  const musicUrl = resolveUrlField(music.playUrl);

  if (!standardUrl && !hdUrl) {
    throw new TikTokResolveError(
      "No downloadable video was found for this link. TikTok may have blocked this request."
    );
  }

  return {
    id: item.id || null,
    caption: item.desc || "",
    author: {
      username: author.uniqueId || null,
      nickname: author.nickname || null,
      avatar: resolveUrlField(author.avatarThumb),
    },
    cover: resolveUrlField(video.cover) || resolveUrlField(video.originCover),
    durationSeconds: video.duration ? Math.round(video.duration) : null,
    stats: {
      plays: Number(stats.playCount) || 0,
      likes: Number(stats.diggCount) || 0,
      comments: Number(stats.commentCount) || 0,
      shares: Number(stats.shareCount) || 0,
    },
    music: {
      title: music.title || null,
      author: music.authorName || null,
    },
    downloads: {
      standard: standardUrl || hdUrl,
      hd: hdUrl && hdUrl !== standardUrl ? hdUrl : null,
      mp3: musicUrl || null,
    },
  };
}
