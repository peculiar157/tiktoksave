"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";

export default function DownloadForm() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");
  const [video, setVideo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) {
      setStatus("error");
      setError("Paste a TikTok video link first.");
      return;
    }

    setStatus("loading");
    setError("");
    setVideo(null);

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Couldn't process that link.");
      }

      setVideo(data.video);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue(text.trim());
    } catch {
      // Clipboard permission denied or unsupported — user can paste manually.
    }
  }

  return (
    <div id="downloader" className="w-full scroll-mt-24">
      <form
        onSubmit={handleSubmit}
        className="card-surface flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:rounded-full sm:p-2 sm:pl-6"
      >
        <label htmlFor="tiktok-url" className="sr-only">
          TikTok video link
        </label>
        <input
          id="tiktok-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="Paste a TikTok video link here…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-brand-950 outline-none placeholder:text-slate-400 sm:px-2"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="rounded-full border border-brand-200 px-4 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50 sm:py-2.5"
          >
            Paste
          </button>
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-1 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none sm:py-2.5"
          >
            {status === "loading" ? "Fetching…" : "Get download links"}
          </button>
        </div>
      </form>

      {status === "error" ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {status === "success" && video ? (
        <div className="mt-5">
          <ResultCard video={video} />
        </div>
      ) : null}

      <p className="mt-4 text-center text-xs text-brand-100/80 sm:text-left">
        Works with public videos only. By downloading, you confirm you have
        the right to save and use this content.
      </p>
    </div>
  );
}
