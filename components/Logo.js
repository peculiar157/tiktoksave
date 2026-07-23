import Link from "next/link";

export default function Logo({ dark = false }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-semibold tracking-tight"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
          dark
            ? "bg-white text-brand-700"
            : "bg-gradient-to-br from-brand-500 to-brand-700 text-white"
        }`}
      >
        D
      </span>
      <span className={dark ? "text-white" : "text-brand-950"}>
        DL<span className="text-accent-500">Tok</span>
      </span>
    </Link>
  );
}
