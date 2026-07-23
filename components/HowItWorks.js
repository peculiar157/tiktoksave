const STEPS = [
  {
    title: "Copy the link",
    body: "Open TikTok, find the video, tap Share, then Copy Link.",
  },
  {
    title: "Paste it in TikTokSave",
    body: "Drop the link into the box above and hit “Get download links”.",
  },
  {
    title: "Choose your format",
    body: "Pick MP4 (with an HD option) or MP3 — it opens in a new tab, ready for you to save.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">
          How it works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-slate-500">
          Three steps, no sign-up, nothing to install.
        </p>
      </div>

      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl bg-brand-50 p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 font-semibold text-brand-950">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
