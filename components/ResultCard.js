function formatCount(n) {
  if (!n) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export default function ResultCard({ video }) {
  const baseName = video.author?.username
    ? `tiktoksave_${video.author.username}_${video.id || ""}`
    : `tiktoksave_${video.id || "video"}`;

  const options = [
    video.downloads.standard && {
      key: "mp4-standard",
      label: "Download MP4",
      hint: "Opens in a new tab · right-click → Save video as",
      url: video.downloads.standard,
      filename: `${baseName}.mp4`,
      accent: "bg-brand-600 hover:bg-brand-700 text-white",
    },
    video.downloads.hd && {
      key: "mp4-hd",
      label: "Download HD MP4",
      hint: "Highest bitrate available · new tab, right-click → Save",
      url: video.downloads.hd,
      filename: `${baseName}_hd.mp4`,
      accent: "bg-brand-950 hover:bg-brand-900 text-white",
    },
    video.downloads.mp3 && {
      key: "mp3",
      label: "Download MP3",
      hint: "Audio only · new tab, right-click → Save audio as",
      url: video.downloads.mp3,
      filename: `${baseName}.mp3`,
      accent: "bg-accent-500 hover:bg-accent-600 text-brand-950",
    },
  ].filter(Boolean);

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
            {options.map((option) => (
              <a
                key={option.key}
                href={option.url}
                download={option.filename}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className={`inline-flex flex-col rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${option.accent}`}
              >
                <span>{option.label}</span>
                <span className="text-[11px] font-normal opacity-80">
                  {option.hint}
                </span>
              </a>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Downloads open directly from TikTok in a new tab — once it
            loads, right-click (or press and hold on mobile) and choose
            "Save video as" / "Save audio as."
          </p>
        </div>
      </div>
    </div>
  );
}
