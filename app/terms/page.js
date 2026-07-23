import Container from "@/components/Container";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Terms of Service",
  description: `The terms for using ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="prose-brand mx-auto max-w-2xl text-slate-700">
        <h1 className="text-3xl font-bold text-brand-950 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Last updated: July 19, 2026
        </p>

        <p className="mt-6">
          By using {SITE_NAME}, you agree to the terms below. If you don't
          agree with them, please don't use the site.
        </p>

        <h2>What the service does</h2>
        <p>
          {SITE_NAME} lets you generate a direct download of a publicly
          available TikTok video's video and/or audio track, based on a link
          you provide. We don't host, index, or browse TikTok content
          ourselves — every download starts from a link you supply.
        </p>

        <h2>Your responsibilities</h2>
        <ul>
          <li>
            You're responsible for having the right to download and use any
            content you save through this site — your own content, content
            you have permission to use, or content that falls under fair
            use / fair dealing in your jurisdiction.
          </li>
          <li>
            Don't use {SITE_NAME} to infringe on anyone's copyright, harass
            creators, or violate TikTok's own terms of service.
          </li>
          <li>
            Don't attempt to abuse, overload, or reverse-engineer the
            service in a way that disrupts it for other users.
          </li>
        </ul>

        <h2>No affiliation</h2>
        <p>
          {SITE_NAME} is an independent tool and is not affiliated with,
          endorsed by, or sponsored by TikTok or ByteDance Ltd. "TikTok" is a
          trademark of its respective owner.
        </p>

        <h2>No warranty</h2>
        <p>
          The service is provided "as is." Video and audio availability
          depends on TikTok's own servers and page structure, which can
          change without notice — we don't guarantee uninterrupted
          availability or that every link will resolve successfully.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE_NAME} and its
          operators aren't liable for any damages arising from your use of
          the service, including anything related to content you download
          and how you use it afterward.
        </p>

        <h2>Copyright complaints (DMCA)</h2>
        <p>
          If you believe content accessible through this site infringes
          your copyright, please reach out via the{" "}
          <a href="/contact">contact page</a> with details of the video in
          question and a description of your rights to it. Since{" "}
          {SITE_NAME} doesn't host any video files itself, most reports are
          best directed to TikTok directly, but we're glad to help point you
          the right way.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms occasionally. Continuing to use{" "}
          {SITE_NAME} after a change means you accept the updated terms.
        </p>
      </div>
    </Container>
  );
}
