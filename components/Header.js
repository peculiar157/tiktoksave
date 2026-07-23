import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo dark />
        <nav className="hidden items-center gap-7 text-sm font-medium text-brand-100 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#downloader"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-100"
        >
          Download now
        </Link>
      </Container>
    </header>
  );
}
