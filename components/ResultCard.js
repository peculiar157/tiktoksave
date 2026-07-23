"use client";

import { useState } from "react";

function formatCount(n) {
  if (!n) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

// Triggers a real browser "Save As" for an in-memory blob, without
// navigating the page away.
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function ResultCard({ video }) {
  const [pending, setPending] = useState(null); // key of the button currently loading
  const [captureError, setCaptureError] = useState("");

  const baseName = video.author?.username
    ? `tiktoksave_${video.author.username}_${video.id || ""}`
    : `tiktoksave_${video.id || "video"}`;

  // MP4/HD MP4 go through the headless-browser capture route — TikTok's
  // video CDN blocks plain requests entirely (confirmed in testing), so
  // this is the fallback that actually loads a real TikTok page first. See
  // lib/headless.js for the full explanation and its caveats.
  const videoOptions = [
    video.downloads.standard && {
      key: "mp4-standard",
      label: "Download MP4",
      hint: "May take up to ~20s — loads a real TikTok page first",
      targetUrl: video.downloads.standard,
      filename: `${baseName}.mp4`,
      accent: "bg-brand-600 hover:bg-brand-700 text-white",
    },
    video.downloads.hd && {
      key: "mp4-hd",
      label: "Download HD MP4",
      hint: "Highest bitrate available — same ~20s process",
      targetUrl: video.downloads.hd,
      filename: `${baseName}_hd.mp4`,
      accent: "bg-brand-950 hover:bg-brand-900 text-white",
    },
  ].filter(Boolean);

  // MP3 already works reliably as a direct link straight from TikTok — no
  // need to route it through the slower headless capture.
  const mp3Option = video.downloads.mp3 && {
    key: "mp3",
    label: "Download MP3",
    hint: "Audio only · opens in a new tab, right-click → Save audio as",
    url: video.downloads.mp3,
    accent: "bg-accent-500 hover:bg-accent-600 text-brand-950",
  };

  async function handleCapture(option) {
    if (!video.pageUrl) {
      setCaptureError("Missing the original TikTok page link — try resolving the video again.");
      return;
    }

    setPending(option.key);
    setCaptureError("");

    try {
      const params = new URLSearchParams({
        pageUrl: video.pageUrl,
        targetUrl: option.targetUrl,
        filename: option.filename,
      });
      const res = await fetch(`/api/capture?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Couldn't capture this video. Try again.");
      }

      const blob = await res.blob();
      saveBlob(blob, option.filename);
    } catch (err) {
      setCaptureError(err.message || "Something went wrong capturing the video.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="card-surface w-full rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-xl bg-brand-100 sm:mx-0">
          {video.cover ? (
            // Third-party, per-request CDN image: plain <img> avoids
            // next/image remote-pattern config and hotlink issues.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.cover}
              alt="Video cover"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {video.author?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.author.avatar}
                alt=""
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full bg-brand-100 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-950">
                {video.author?.nickname || video.author?.username || "TikTok video"}
              </p>
              {video.author?.username ? (
                <p className="truncate text-xs text-slate-400">
                  @{video.author.username}
                </p>
              ) : null}
            </div>
          </div>

          {video.caption ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
              {video.caption}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>▶ {formatCount(video.stats?.plays)} plays</span>
            <span>♥ {formatCount(video.stats?.likes)} likes</span>
            <span>💬 {formatCount(video.stats?.comments)} comments</span>
            {video.music?.title ? (
              <span className="truncate">
                🎵 {video.music.title}
                {video.music.author ? ` — ${video.music.author}` : ""}
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {videoOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleCapture(option)}
                disabled={pending === option.key}
                className={`inline-flex flex-col rounded-xl px-4 py-2.5 text-left text-sm font-semibold shadow-sm transition disabled:cursor-wait disabled:opacity-70 ${option.accent}`}
              >
                <span>
                  {pending === option.key ? "Capturing…" : option.label}
                </span>
                <span className="text-[11px] font-normal opacity-80">
                  {pending === option.key
                    ? "Loading the TikTok page and grabbing the video…"
                    : option.hint}
                </span>
              </button>
            ))}

            {mp3Option ? (
              <a
                href={mp3Option.url}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className={`inline-flex flex-col rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${mp3Option.accent}`}
              >
                <span>{mp3Option.label}</span>
                <span className="text-[11px] font-normal opacity-80">
                  {mp3Option.hint}
                </span>
              </a>
            ) : null}
          </div>

          {captureError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {captureError}
            </p>
          ) : null}

          <p className="mt-3 text-xs text-slate-400">
            MP3 opens directly from TikTok in a new tab — right-click the
            audio player and choose "Save audio as." MP4 downloads happen
            through your browser automatically once captured.
          </p>
        </div>
      </div>
    </div>
  );
}
