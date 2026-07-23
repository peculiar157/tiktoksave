import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            TikTokSave is a free tool for saving public TikTok videos without
            the watermark, in MP4 or MP3, straight from your browser. No
            account, no app install, no watermark.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-950">Site</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-brand-700">
                Downloader
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-700">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-950">Legal</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link href="/privacy" className="hover:text-brand-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-700">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-700">
                DMCA / Copyright
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-brand-100 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} TikTokSave. Not affiliated with TikTok.</p>
          <p>Built for personal, fair-use downloads only.</p>
        </Container>
      </div>
    </footer>
  );
}
