# TikTokSave

A free TikTok video/audio downloader built with Next.js — no paid third-party
API, SEO-ready, with a Markdown blog and the legal pages Google AdSense
expects to see.

- **Download engine**: reads the same public JSON data TikTok's own web
  player uses (see `lib/tiktok.js`) to get direct, unwatermarked MP4/HD
  MP4/MP3 links — no TikTok developer account, no paid API.
- **Frontend**: Next.js App Router + Tailwind CSS, blue-themed custom design.
- **Blog**: Markdown-based (`content/blog/*.md`), 5 starter SEO articles included.
- **SEO**: per-page metadata, sitemap.xml, robots.txt, OG image, JSON-LD.
- **Monetization-ready**: About/Privacy/Terms/Contact pages, AdSense script
  scaffold, ads.txt — all inactive until you add real IDs.

---

## 1. Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000 — paste a **public** TikTok video link into the
box and click "Get download links."

> **Important, please read**: I built and tested this from a sandboxed
> environment that couldn't actually reach tiktok.com, so I could not
> verify the scraper end-to-end against a live video. The extraction logic
> targets TikTok's well-documented public page JSON structure (the same
> technique used by most free/open-source TikTok downloaders), and the
> app builds, lints, and runs cleanly — but please test it yourself with a
> handful of real links before you rely on it. If TikTok has changed their
> page markup, or you see failures in Vercel's function logs, all the
> extraction logic lives in one file — `lib/tiktok.js` — so it's a
> contained fix. See "Known limitations" at the bottom for more on this
> trade-off.

---

## 2. Push it to GitHub

If you've never used Git/GitHub before, here's the whole flow:

1. Create a free account at [github.com](https://github.com) if you don't
   have one.
2. Click the **+** icon (top right) → **New repository**. Name it
   `tiktoksave` (or anything you like), leave it **Public** or **Private** as
   you prefer, and click **Create repository** — don't add a README,
   .gitignore, or license, since this project already has them.
3. GitHub will show you a page with commands. Back in your terminal,
   inside this project folder, run:

   ```bash
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/tiktoksave.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your actual GitHub username (GitHub shows
   you the exact URL to copy on that same page).

That's it — your code is now on GitHub.

---

## 3. Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign up using your **GitHub**
   account (this makes step 2 automatic).
2. Click **Add New… → Project**.
3. Pick the `tiktoksave` repo from the list and click **Import**.
4. Vercel auto-detects Next.js — you don't need to change any build
   settings. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://tiktoksave.vercel.app` (or your real domain once you have one) |

5. Click **Deploy**. In about a minute you'll get a live URL like
   `https://tiktoksave.vercel.app`.

Every time you `git push` to `main` from now on, Vercel automatically
redeploys — that's the whole workflow.

### Custom domain (optional)

In your Vercel project → **Settings → Domains**, add your domain and follow
the DNS instructions it gives you. Once it's live, update
`NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to match, and
redeploy (Settings → Deployments → ⋯ → Redeploy).

---

## 4. Turning on Google AdSense

1. Apply at [google.com/adsense](https://www.google.com/adsense) using your
   live site URL. Google typically wants to see a working site with real
   content and clear navigation — this project already has the Privacy
   Policy, Terms, About, and Contact pages AdSense reviewers look for, plus
   5 blog posts.
2. Once approved, Google gives you a publisher ID like `ca-pub-1234567890123456`.
3. In Vercel → **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-1234567890123456` |
   | `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | `pub-1234567890123456` (same ID, no `ca-` prefix) |

4. Redeploy. Ad slots are already placed on the homepage and blog posts
   (`components/AdSlot.js`) — they render nothing until these env vars are
   set, so nothing changes on your site until you're approved.
5. In AdSense, use **Ads → By site** to auto-place ads, or replace the
   placeholder `slot="..."` values in `app/page.js` and
   `app/blog/[slug]/page.js` with real ad unit IDs from AdSense for manual
   placement.

---

## 5. Helping it actually rank on Google

1. Go to [Google Search Console](https://search.google.com/search-console),
   add your site, and verify ownership (Vercel domains support the HTML tag
   or DNS verification methods).
2. Submit your sitemap: `https://your-domain.com/sitemap.xml`.
3. Keep adding blog posts — every new `.md` file in `content/blog/` becomes
   a new indexable page automatically (see "Adding a new blog post" below).
   Fresh, genuinely useful content is what actually moves rankings over
   time; there's no shortcut around that.
4. Get a few other sites to link to yours if you can (a Reddit post, a
   Product Hunt launch, a mention on a related blog) — backlinks matter
   more than most on-page tweaks.

### Adding a new blog post

Create a new file in `content/blog/`, e.g. `content/blog/my-new-post.md`:

```markdown
---
title: "Your Post Title"
description: "One or two sentences for search engines and the blog listing."
date: "2026-08-01"
tags: ["guide"]
---

Your content here, in normal Markdown.
```

Commit and push — Vercel rebuilds and the post is live at
`/blog/my-new-post`, automatically included in the sitemap.

---

## Project structure

```
app/
  page.js                 → homepage (hero, downloader, FAQ)
  api/resolve/route.js    → resolves a TikTok link to download URLs
  api/download/route.js   → streams the actual file to the browser
  blog/                   → blog listing + [slug] post pages
  about/ privacy/ terms/ contact/  → legal & info pages
  sitemap.js robots.js ads.txt/ opengraph-image.js  → SEO plumbing
lib/
  tiktok.js  → all TikTok scraping/parsing logic lives here
  blog.js    → Markdown blog post loading
  site.js    → site name/URL/description constants
components/  → UI pieces (Header, Footer, DownloadForm, ResultCard, FAQ, …)
content/blog/  → your blog posts, as Markdown files
```

---

## Known limitations (please read before relying on this)

- **Public videos only.** Private/friends-only videos have no public page
  to read, so they can't be downloaded — this is a hard limit, not a bug.
- **TikTok can change their page structure.** The whole approach depends on
  TikTok continuing to embed a `__UNIVERSAL_DATA_FOR_REHYDRATION__` JSON
  blob in their video pages. If they change this, resolving will start
  failing until `lib/tiktok.js` is updated to match — this is the standard
  trade-off of not using a paid, maintained API.
- **TikTok may rate-limit or challenge automated requests.** Under heavy
  traffic, TikTok could start returning CAPTCHAs or blocking requests from
  a hosting provider's IP ranges. If you start seeing a lot of failures in
  production, that's the most likely cause, and there's no fully free fix
  for it beyond retry logic and being a good citizen with request volume.
- **Download links expire quickly.** They come straight from TikTok's own
  CDN with short-lived tokens, so the app always resolves fresh — don't
  cache or reuse a resolved link.
