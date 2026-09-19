# Articles

Every article on the site is a markdown file in this folder. There is no
database, no CMS, and no separate copy of the text anywhere else — the file
you are reading on GitHub is the same file the site renders.

This README has no frontmatter, which is how the site knows it is not an
article. See [Publishing rule](#publishing-rule) below.

```
docs/
├── README.md                 ← you are here (not published)
├── Dead_letter_queue/        ← the DLQ series: index + 7 parts
├── fixes&solutions/          ← the Changa series: index + 11 parts
└── notes/                    ← standalone articles
```

---

## Adding an article

**1. Create the file.** Standalone articles go in `notes/`, named after the
slug. Series parts go in the series folder, keeping the number prefix.

```
docs/notes/why-i-stopped-using-x.md
```

**2. Write the frontmatter, then an `# H1`, then the article.**

```markdown
---
slug: why-i-stopped-using-x
title: "Why I stopped using X"
excerpt: >-
  One or two sentences. This is the card text on /blog and the
  meta description search engines show.
category: backend
date: 2026-09-19
tags: [python, testing]
---
# Why I stopped using X

Opening paragraph...

## A section
```

**3. That's it.** No registry to update, no index to edit. The dev server
picks it up immediately; `/blog`, the homepage list, the category filters and
the sitemap of routes all follow from the file.

---

## Frontmatter reference

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | Lowercase and hyphenated. **This is the public URL** (`/blog/<slug>`) — changing it breaks existing links. |
| `title` | yes | Quote it. A bare `Title: subtitle` is ambiguous YAML and will be rejected. |
| `excerpt` | yes | Use the `>-` block so you can wrap lines without escaping anything. |
| `category` | yes | One of: `backend`, `career`, `frontend`, `infrastructure`, `mobile`. To add one, edit `CATEGORIES` in `src/lib/content/posts.js`. |
| `date` | yes | `YYYY-MM-DD`. Sorts the blog, newest first. |
| `tags` | yes | Inline list: `[one, two]`. |
| `series` | no | The slug of the series index post. |
| `part` | no | Part number within the series. Omit on the index itself. |

Anything else is rejected — an unknown key is almost always a typo in a key
that was meant to do something.

**Not fields:** reading time is counted from the text, and the `/blog`
category filters are derived from the articles that exist. Both used to be
typed by hand and both had drifted.

---

## Publishing rule

**A markdown file under `docs/` becomes a published article by having
frontmatter.** A file without it — this README, a design note, a scratch
document — is ignored by the site and stays a repo document.

That means there is no exclusion list to maintain, and no way to
accidentally publish a draft: just leave the frontmatter off until it is
ready.

A file that *has* frontmatter but gets it wrong is a hard error, naming the
file and the field. It will not build.

---

## Series

A series is an index article plus its parts.

- The **index** declares `series: <its-own-slug>` and no `part`.
- Each **part** declares the same `series:` value and its `part:` number.

Reading order comes from `part`, not from `date` — an index is usually
published last, once the series is finished, so date order would walk it
backwards. Parts get a "Part 3 of 7" line linking back to the index, and
"Next up" follows the series instead of the calendar.

## Linking between articles

Link with a **relative path to the other markdown file**, the way you
normally would on GitHub:

```markdown
See [Part 2](02-retry-policy-and-idempotency.md) for the retry budget.
```

The site rewrites that to `/blog/dlq-retry-policy-idempotency` when it loads
the file. Write for GitHub; the site adapts. A relative link pointing at a
file that is not a published article is a build error, so cross-references
cannot silently rot.

---

## Checking your work

```bash
npm run dev     # the article appears at /blog/<slug>
npm test        # validates every article's frontmatter and links
npm run build   # what CI runs
```

Most authoring mistakes surface as a thrown error with the filename in it
rather than as something wrong on the page.

## How it works

The loader and its reasoning live in
[`architecture/content-layer.md`](architecture/content-layer.md). The code is
`src/lib/content/`.
