import Container from "@/components/Container";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
  alternates: { canonical: "/contact" },
};

const CONTACT_EMAIL = "hello@tiktoksave.example.com";

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="prose-brand mx-auto max-w-2xl text-slate-700">
        <h1 className="text-3xl font-bold text-brand-950 sm:text-4xl">
          Contact
        </h1>

        <p className="mt-6">
          Questions, bug reports, or copyright concerns — we read everything
          that comes in. Reach out at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>Bug reports</h2>
        <p>
          If a specific link won't process, please include the exact TikTok
          URL and a screenshot of the error message — it helps us tell
          whether it's a private video, a region lock, or something we need
          to fix on our end.
        </p>

        <h2>Copyright / DMCA requests</h2>
        <p>
          {SITE_NAME} doesn't host video files — every download is generated
          on demand from a link you provide, sourced directly from TikTok's
          own servers. If you're a rights holder with a concern about a
          specific video, include the video's TikTok URL and a description
          of your rights to the content, and we'll review it promptly.
        </p>

        <h2>Business inquiries</h2>
        <p>
          For partnerships or advertising inquiries, use the same email
          above with a short description of what you have in mind.
        </p>
      </div>
    </Container>
  );
}
