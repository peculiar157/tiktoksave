import Container from "@/components/Container";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `What ${SITE_NAME} is, how it works, and why it's free.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="prose-brand mx-auto max-w-2xl text-slate-700">
        <h1 className="text-3xl font-bold text-brand-950 sm:text-4xl">
          About {SITE_NAME}
        </h1>

        <p className="mt-6">
          {SITE_NAME} is a small, free tool for saving public TikTok videos
          without the watermark. Paste a link, and we read the same publicly
          available page data that your browser would if you opened the
          video directly — then hand you a clean MP4 (with an HD option
          where available) or an MP3 of the audio.
        </p>

        <h2>Why we built it</h2>
        <p>
          Watermarked downloads are annoying if you're trying to edit a clip,
          reference a sound, or archive your own content. Most existing
          tools either bury the download behind ads or charge for an "HD"
          tier. We wanted something simple that just works, stays free, and
          doesn't collect more than it needs to.
        </p>

        <h2>How it works, briefly</h2>
        <p>
          TikTok's own public video pages already contain a direct link to
          the unwatermarked source file — it's the same data the TikTok web
          player itself uses. {SITE_NAME} reads that data server-side and
          gives you a direct download, without needing a TikTok developer
          account or a paid third-party API.
        </p>

        <h2>What we don't do</h2>
        <ul>
          <li>We don't require an account or login.</li>
          <li>
            We don't store copies of the videos people look up on our
            servers.
          </li>
          <li>We don't work with private, friends-only, or deleted videos.</li>
        </ul>

        <p>
          Have a question or found something broken? Head over to the{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </Container>
  );
}
