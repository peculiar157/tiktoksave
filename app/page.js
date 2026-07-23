import Container from "@/components/Container";
import DownloadForm from "@/components/DownloadForm";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import AdSlot from "@/components/AdSlot";
import { SITE_TAGLINE } from "@/lib/site";

export const metadata = {
  title: `${SITE_TAGLINE} — Free TikTok Downloader`,
  description:
    "Paste a TikTok link and download the video without the watermark as MP4 (with an HD option) or MP3. Free, no login, no app install.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <section className="bg-mesh relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-16 top-10 hidden h-72 w-72 rounded-full bg-accent-400/20 blur-3xl sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl"
        />

        <Container className="relative flex flex-col items-center text-center">
          <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-brand-50">
            100% free · no watermark · no login
          </span>

          <h1 className="text-balance mt-6 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Save any TikTok video, watermark-free
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-brand-100 sm:text-lg">
            Paste a link, pick MP4, HD MP4, or MP3, and save it in seconds.
            No account, no software, no watermark.
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <DownloadForm />
          </div>
        </Container>
      </section>

      <Container>
        <AdSlot slot="0000000000" className="my-10" />
        <HowItWorks />
        <Features />
        <AdSlot slot="0000000001" className="my-10" />
        <FAQ />
      </Container>
    </>
  );
}
