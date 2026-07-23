"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Drop-in AdSense ad unit.
 *
 * Does nothing until you (a) get approved for AdSense and (b) set
 * NEXT_PUBLIC_ADSENSE_CLIENT + pass a real `slot` id. Until then it quietly
 * renders nothing, so the site works fine before you're monetized.
 */
export default function AdSlot({ slot, format = "auto", className = "" }) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet (e.g. blocked by an ad blocker) — safe to ignore.
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
