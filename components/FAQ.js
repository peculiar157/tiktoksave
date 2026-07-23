"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is DLTok free to use?",
    a: "Yes. Every download — MP4, HD MP4, and MP3 — is free, with no account, watermark, or hidden limits.",
  },
  {
    q: "Why can't I download a private video?",
    a: "DLTok can only read publicly viewable TikTok pages, the same way a browser would. Private, friends-only, or deleted videos can't be accessed.",
  },
  {
    q: "Will the video have a TikTok watermark on it?",
    a: "No. DLTok pulls the original, unwatermarked file straight from the source rather than recording the on-screen watermark version.",
  },
  {
    q: "Does DLTok store my downloads?",
    a: "No. We don't keep a copy of videos you look up, and we don't log what you personally download.",
  },
  {
    q: "Is it legal to download TikTok videos?",
    a: "Downloading content you own, have permission to use, or that falls under fair use in your jurisdiction is generally fine. Re-uploading someone else's content without credit or permission can violate copyright and TikTok's own terms — that part is on you to check.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-2xl divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
              >
                <span className="font-medium text-brand-950">{item.q}</span>
                <span
                  className={`shrink-0 text-brand-500 transition-transform ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open ? (
                <p className="px-5 pb-4 text-sm leading-6 text-slate-500">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
