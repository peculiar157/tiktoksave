import Container from "@/components/Container";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data, cookies, and advertising.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="prose-brand mx-auto max-w-2xl text-slate-700">
        <h1 className="text-3xl font-bold text-brand-950 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Last updated: July 19, 2026
        </p>

        <p className="mt-6">
          This policy explains what information {SITE_NAME} collects, how
          it's used, and the choices you have. {SITE_NAME} is designed to
          collect as little personal information as possible.
        </p>

        <h2>Information we process</h2>
        <p>
          When you paste a TikTok link, that link and the resulting video
          metadata (caption, author, stats, media URLs) are processed
          temporarily in memory to generate your download — we don't write
          it to a database or keep a history tied to you.
        </p>
        <p>
          Like most websites, our hosting provider automatically logs
          standard technical data for security and reliability purposes
          (IP address, browser type, request timestamps). We don't
          cross-reference this with the links you download.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          {SITE_NAME} may display advertising served by Google AdSense.
          Google and its partners may use cookies to serve ads based on your
          prior visits to this or other websites. You can opt out of
          personalized advertising by visiting Google's{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ads Settings
          </a>
          , or by visiting{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          .
        </p>

        <h2>Third-party services</h2>
        <p>
          To generate a download, we make a request to TikTok's public
          servers on your behalf. That request is subject to TikTok's own
          privacy practices for the data it receives (e.g. request headers
          typical of any web request). We don't share your activity on this
          site with TikTok beyond that request itself.
        </p>

        <h2>Children's privacy</h2>
        <p>
          {SITE_NAME} is not directed at children under 13, and we do not
          knowingly collect personal information from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this page from time to time. Continued use of{" "}
          {SITE_NAME} after changes means you accept the revised policy.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach out via the{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </Container>
  );
}
