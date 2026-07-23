const FEATURES = [
  {
    title: "No watermark",
    body: "Videos save as the clean original file — no TikTok logo overlay.",
    icon: "✨",
  },
  {
    title: "MP4 & MP3",
    body: "Grab the full video, or just pull the audio track as an MP3.",
    icon: "🎬",
  },
  {
    title: "No account needed",
    body: "No sign-up, no app install, nothing added to your device.",
    icon: "🔓",
  },
  {
    title: "Fast, browser-based",
    body: "Works on desktop and mobile — Chrome, Safari, Firefox, Edge.",
    icon: "⚡",
  },
  {
    title: "Privacy-first",
    body: "We don't store the videos you look up or track your downloads.",
    icon: "🛡️",
  },
  {
    title: "Always free",
    body: "No premium tier, no download limits, no watermark upsell.",
    icon: "💙",
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">
          Why people use DLTok
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-brand-100 bg-white p-6 transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="mt-3 font-semibold text-brand-950">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
