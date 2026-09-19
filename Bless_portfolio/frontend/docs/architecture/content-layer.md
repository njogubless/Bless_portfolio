# The content layer: moving articles out of a data file

**Status:** implemented
**Date:** 2026-09-19
**Affects:** `src/lib/content/`, `src/pages/{Blog,BlogPost,Home,Work}.jsx`, `docs/`

---

## 1. Summary

Articles used to live in a single 2,172-line JavaScript file as an array of
objects, with each article's body as a template literal. They now live as
individual markdown files under `docs/`, loaded through a small content
layer that parses, validates and transforms them at module load.

The change removed roughly 1,800 lines of prose that existed in two places
at once, replaced four pieces of hand-maintained metadata with derived
values, and fixed a navigation bug that had been invisible because nothing
in the data model knew what a series was.

No article's text changed. That was verified mechanically, not by reading —
see [section 6](#6-how-i-verified-nothing-changed-for-readers).

---

## 2. What was there before

### 2.1 One file holding everything

`src/lib/data/posts.js` — 2,172 lines, 156 KB, 24 articles:

```js
const posts = [
  {
    id: 1,
    slug: 'flutter-state-management-riverpod',
    title: 'Why I switched to Riverpod for Flutter state management',
    // ...
    content: `## The problem with Provider

Provider works, but it starts to feel brittle...

\`\`\`dart
final userProvider = FutureProvider<User>((ref) async { ... });
\`\`\`
`,
  },
  // ...23 more
]
```

The immediate problems with this are the obvious ones — the file is too big
to navigate, every article shares one git blame, and two people editing
different articles conflict in the same file. But those are the least
interesting problems.

### 2.2 The same prose existed twice

The repository already had the articles as markdown:

```
docs/Dead_letter_queue/     8 files    1,505 lines
docs/fixes&solutions/      12 files      314 lines
```

Those 19 files and the corresponding entries in `posts.js` were the same
text. Around 1,800 lines of prose maintained in two places, with nothing
connecting them. Editing an article meant remembering to edit it twice.
Nothing would fail if you forgot — the two copies would simply disagree,
and you would find out when a reader did.

This was the real problem. File size is an inconvenience; a duplicated
source of truth is a defect that gets worse with every article added.

### 2.3 Markdown escaped into a JavaScript string

Because bodies were template literals, every code fence in every article had
to be backslash-escaped. 242 lines in the file contained `` \` ``.

The cost is not just ugliness. Writing in that file means no markdown
preview, no prose linting, no syntax highlighting inside code samples, and a
class of error — a stray unescaped backtick — that breaks the *build* rather
than rendering slightly wrong.

### 2.4 Metadata that was authored but should have been derived

`readingTime` was typed by hand. It was wrong on **19 of the 24 articles**,
in some cases badly:

| Article | Words | Claimed | Actual |
|---|---:|---|---|
| `flutter-state-management-riverpod` | 117 | 5 min read | 1 min read |
| `dockerising-django-production` | 169 | 8 min read | 1 min read |
| `kubernetes-for-solo-devs` | 139 | 6 min read | 1 min read |
| `building-in-kenya` | 168 | 7 min read | 1 min read |

The four worst cases are the four oldest articles — they were presumably
written longer, trimmed, and the estimate never revisited. This is the
signature of authored-but-derivable data: it is correct the day it is
written and decays silently.

Alongside it:

- `categories` was a hardcoded array at the bottom of the file that had to
  be kept in step with the articles above it by hand.
- `id: 1..24` was read by nothing. `slug` was already the key.

### 2.5 Series structure existed only as prose

Seven of the articles form a series. That fact was encoded nowhere in the
data — only as hand-written markdown links inside the index article's body.
Adding a part meant editing prose in a different article.

The consequence was a live bug. `BlogPost.jsx` computed "Next up" as:

```js
const index = posts.findIndex((p) => p.slug === slug)
const next = posts[(index + 1) % posts.length]
```

That is *date* order. Finishing Part 1 of a seven-part series offered the
reader whatever happened to be published next, not Part 2. A reader landing
on Part 4 from a search result had no indication that three earlier parts
existed.

---

## 3. The shape of the change

```
docs/                             ← articles (also the repo's documentation)
├── README.md                     ← authoring guide, no frontmatter → not published
├── architecture/content-layer.md ← this file, not published
├── Dead_letter_queue/            ← series index + 7 parts
├── fixes&solutions/              ← series index + 11 parts
└── notes/                        ← 4 standalone articles

src/lib/content/
├── frontmatter.js   parse a YAML-subset block → { data, body }
├── schema.js        field validators; fail loudly, naming file and field
├── markdown.js      strip H1, derive reading time, rewrite links
├── collection.js    generic: raw files + schema + transform → frozen collection
└── posts.js         the blog collection and its query API

src/components/ui/Markdown.jsx    renderer with router-aware links
```

The flow, once per page load:

```
import.meta.glob('/docs/**/*.md')      raw file contents, keyed by path
        │
        ▼  pass 1 — per file
parseFrontmatter()  ──→ no frontmatter? skip: this file is not an article
        │
        ▼
validate(schema)    ──→ throws, naming the file and the field
        │
        ▼  pass 2 — with every file's metadata now known
transform()         ──→ strip H1 · derive readingTime · rewrite links
        │
        ▼
frozen, sorted collection  ──→ getAllPosts() · getPostBySlug() · getSeries() …
```

Two passes matter: link rewriting needs the full slug registry before it can
resolve `02-retry-policy.md` to a route, so nothing can be transformed until
everything has been parsed.

Pages no longer import an array. They call functions:

```js
import { getRecentPosts } from '../lib/content/posts'

{getRecentPosts(3).map((post) => …)}
```

---

## 4. Decisions

### D1 — `docs/` is the single source, and the site reads from it

**Context.** The prose existed in `docs/` and in `posts.js`. One had to go.

**Decision.** Keep the markdown in `docs/` and have the site read it. Delete
`posts.js`.

**Why.** The alternative — move the canonical copy into `src/content/` and
leave `docs/` as an index — is defensible, but it makes the repo's own
documentation a second-class derivative of the website. These articles *are*
the documentation of real engineering work; someone reading the repo on
GitHub is as legitimate an audience as someone on the site. Reading from
`docs/` serves both from one file.

The deciding factor was empirical. Before committing to it I diffed all 19
pairs. Eleven were byte-identical. The other eight differed by **one or two
lines each**, and always the same way: a link written as
`](02-retry-policy-and-idempotency.md)` in `docs/` versus
`](/blog/dlq-retry-policy-idempotency)` in `posts.js`.

That is a mechanical, total difference — which means it can be handled by a
transform rather than by a human remembering. See [D7](#d7--relative-md-links-are-rewritten-to-routes-at-load).

**Trade-off.** `src/` now depends on a directory outside it. Vite handles
this fine (`docs/` is inside the project root), but it is an unusual arrow
to draw and needs the comment it has.

### D2 — Frontmatter is what makes a file an article

**Context.** Globbing `docs/**/*.md` picks up everything, including READMEs
and design notes that are not articles.

**Decision.** A file with no frontmatter block is skipped. A file that *has*
frontmatter but gets it wrong is a hard error.

**Why.** The alternatives are an explicit registry of published files (which
reintroduces the "edit two places" problem this change exists to remove) or
an exclusion list (which fails open — forget to add to it and you publish a
draft).

This rule fails closed and needs no maintenance. `docs/README.md` and this
very file are unpublished for exactly this reason, which also makes the rule
self-demonstrating.

**Trade-off.** A missing frontmatter block is silent. If you write an
article and cannot find it on the site, this is why. The authoring guide
leads with it.

### D3 — `slug` is authored in frontmatter, not derived from the filename

**Context.** Deriving the slug from the filename would be one less field.

**Decision.** Author it explicitly.

**Why.** The existing filenames are ordinal (`01-schema-truth.md`) and the
existing public URLs are descriptive (`/blog/changa-schema-truth`). Deriving
would have changed every URL on the site — breaking inbound links, shared
links and search rankings, in exchange for saving one line per file.

More generally: a slug is a **public contract**, and a filename is an
organisational convenience. Coupling them means renaming a file for tidiness
silently breaks a URL. Keeping them separate lets the folder be reorganised
freely. The collection enforces slug uniqueness, so the risk of decoupling
them is covered.

### D4 — A hand-written frontmatter parser instead of `js-yaml`

**Context.** Parsing frontmatter needs YAML.

**Decision.** ~130 lines parsing a five-construct subset, with an explicit
refusal for anything else.

**Why.** The only consumer is two dozen static files using five shapes.
Shipping a general YAML engine to the browser to read them costs more than
it saves, and YAML's full grammar is a liability here — its implicit typing
rules are a well-known source of surprise.

The important property is not smallness, it is the refusal. A parser that
guesses at input it does not understand can put *wrong metadata on a live
page*, which is far worse than a build that stops. So an ambiguous unquoted
value throws rather than being best-guessed:

```
title: Schema truth: why we deleted create_tables()
       └─ ambiguous → FrontmatterError, "wrap it in quotes"
```

**Trade-off.** Authors must quote titles containing a colon and cannot use
block-sequence syntax (`- item`). Both are enforced with an error message
that says what to do instead. If the constraint ever chafes, swapping in
`js-yaml` means changing one module.

### D5 — Bodies load eagerly

**Context.** `import.meta.glob` can load eagerly (everything in the bundle)
or lazily (a chunk per article, fetched on navigation).

**Decision.** Eager, behind an abstraction that makes it reversible.

**Why.** Lazy loading is genuinely better for a large corpus, but at 24
articles it costs a custom Vite plugin to split each file's metadata from its
body — the `/blog` list needs the metadata of every article while needing
the body of none. That is a plugin to maintain, for a route that is already
code-split, to save a few tens of kilobytes.

The architectural point is that this is a **reversible decision held in one
place**. Pages call functions and never see the loader. Switching to lazy
bodies means changing the glob in `posts.js` and nothing else.

**Trade-off.** Article prose is ~58 KB gzipped and, because the homepage
lists three recent articles, it loads there too. See
[section 8](#8-known-limitations-and-follow-ups) — this is the main
outstanding item, and it is not a regression.

### D6 — Metadata is derived wherever it can be

**Context.** See [2.4](#24-metadata-that-was-authored-but-should-have-been-derived).

**Decision.** `readingTime` is counted from the text. The category filter
list is derived from the articles that exist. `id` is deleted. `slug`,
`title`, `excerpt`, `category`, `date` and `tags` remain authored, because
they are genuinely editorial.

**Why.** The general rule: *if a value can be computed from the content, it
must be, because a hand-maintained copy is correct only on the day it is
written.* Nineteen wrong reading times is the evidence.

**Trade-off.** Nineteen displayed values changed, most by a minute. The old
numbers were simply false, so this is a correction, but it is a visible
change and worth knowing about.

### D7 — Relative `.md` links are rewritten to routes at load

**Context.** [D1](#d1--docs-is-the-single-source-and-the-site-reads-from-it)
established that the only difference between the two copies was link syntax.

**Decision.** Author links the GitHub way; rewrite them to site routes when
loading, resolving through the slug registry built in pass 1.

**Why.** This is what makes one file serve two readers. It also converts a
class of rot into a build failure: a relative link to a file that is not a
published article throws, naming both files. Cross-references between
articles — which a series index is made almost entirely of — cannot silently
break.

**Trade-off.** A link can no longer be pasted from a URL bar without
thought, and the transform is invisible if you only read the source file.
Documented in the authoring guide.

### D8 — A series is data, not prose

**Context.** See [2.5](#25-series-structure-existed-only-as-prose).

**Decision.** Two optional fields — `series` (the index's slug) and `part`
(a number, absent on the index itself) — plus `getSeries()`,
`getSeriesNavigation()` and `getNextPost()`.

**Why.** Once the relationship is data, three things follow for free: parts
show "Part 3 of 7" with a link to the index, "Next up" follows reading order,
and the index could render its own contents list instead of a hand-written
one.

Reading order is `part`, explicitly not `date`. A series index is usually
published *last*, once the series is finished, so sorting a series by date
walks it backwards. This is exactly the kind of thing that is obvious once
named and invisible while it is prose.

**Trade-off.** Two more optional fields, and a series index's body still
contains its hand-written contents list. Generating that list from
`getSeries()` is a natural follow-up.

### D9 — The collection factory knows nothing about blog posts

**Context.** The layer could have been written as one `posts.js`.

**Decision.** `collection.js` takes raw files, a schema and a transform, and
returns a frozen, deduplicated, sorted collection. `posts.js` is the only
file that knows what an article is.

**Why.** This is where the reuse actually lives. Adding a second collection
— talks, book notes, case studies — is a schema and a transform, not another
bespoke loader. It also forces a clean seam: validation and parsing cannot
quietly grow blog-specific special cases, because they cannot see the blog.

`projects.js` and `experience.js` are still plain JS arrays. That is fine —
they are structured records, not prose, and the array form suits them. If
either grows long-form descriptions, this is the path.

**Trade-off.** Five small files where one large one would work today. The
indirection earns its keep at the second collection; until then it is a
modest bet on there being one.

---

## 5. Impact on the codebase

### Removed

| | |
|---|---|
| `src/lib/data/posts.js` | 2,172 lines, 156 KB |
| Duplicated prose | ~1,800 lines across 19 files |
| Escaped backticks | 242 lines |
| Hand-maintained `categories` array | derived |
| Hand-typed `readingTime` × 24 | derived |
| `id` field × 24 | unused |

### Added

| | |
|---|---|
| `src/lib/content/` | 5 modules, ~470 lines including doc comments |
| `src/components/ui/Markdown.jsx` | router-aware renderer |
| `src/test/content.test.js` | 30 tests |
| `docs/notes/` | 4 articles that had no file |
| Frontmatter | 247 lines added across 19 files, **0 deleted** |

### Behaviour that changed for readers

1. **Reading times corrected** on 19 articles.
2. **Series navigation** — parts show their position and link to the index;
   "Next up" follows the series.
3. **Internal links no longer reload the page.** Post bodies cross-reference
   each other with site-absolute links; as plain `<a>` each threw away the
   SPA and re-downloaded the bundle. They now route through react-router.

### Behaviour that deliberately did not change

Every slug, every URL, and every word of every article.

### Failure modes that moved from runtime to build time

| Mistake | Before | Now |
|---|---|---|
| Typo in a field name | `undefined` renders | error naming file and field |
| Invalid category | new empty filter chip | error listing valid values |
| Two articles, one slug | last one silently wins | error naming both files |
| Link to a moved article | dead link a reader finds | error naming both files |
| Missing excerpt | empty `<meta description>` | error |
| Stray backtick | build breaks, obscure message | renders as a backtick |

This is the part with the most long-term value. The old file had no way to
be wrong *loudly*.

### Coupling

`Work.jsx` built a write-up URL from a raw slug string:

```js
<Link to={`/blog/${project.writeup.slug}`}>      // before
```

If the article were renamed, the link would point at nothing and quietly
redirect to `/blog`. It now resolves through `getPostBySlug`, so the link
disappears instead of lying. Small, but it is the pattern: cross-references
go through the collection, never through string construction.

---

## 6. How I verified nothing changed for readers

Refactoring 24 articles is worthless if it silently edits one. Reading them
to check is not a verification.

Before deleting `posts.js`, I imported it and wrote every article's body to
a snapshot file. After the refactor I asserted, per article, that the
collection produced the identical `title`, `excerpt`, `category`, `date`,
`tags` and **byte-identical `content`**.

All 24 passed. The only intended difference — derived `readingTime` — was
reported separately and reviewed as the table in [2.4](#24-metadata-that-was-authored-but-should-have-been-derived).

That parity suite was temporary by design: it compared against a snapshot of
deleted code, so it had no meaning once merged. The permanent suite
(`src/test/content.test.js`, 30 tests) covers the parser, the validators,
the transforms, and invariants over the real collection — every article has
the fields the pages render, no body retains an unrewritten relative link,
no body starts with an H1, series parts are contiguous from 1.

Full suite: **39 tests passing.** Build and lint clean.

---

## 7. What is now easy that was not

| Task | Before | Now |
|---|---|---|
| Add an article | edit a 2,172-line file, escape every backtick, invent a reading time, add the category to an array | add a file |
| Fix a typo | edit it in `docs/` *and* `posts.js` | edit the file |
| Reorder a series | rewrite links in the index by hand | change a number |
| Rename an article | find every link by grep and hope | change the slug; broken links fail the build |
| Review an article in a PR | a diff inside a JS string literal | a markdown diff |
| Add a second content type | write another bespoke loader | a schema and a transform |
| Draft without publishing | a branch | leave the frontmatter off |

---

## 8. Known limitations and follow-ups

**The homepage loads all article prose to render three titles.** ~58 KB
gzipped. This was equally true before — the old `Home.jsx` imported the same
156 KB file — so it is not a regression, but it is the main outstanding
performance item. The fix is [D5](#d5--bodies-load-eagerly): a Vite plugin
splitting metadata from body, changing `posts.js` and nothing else. Worth
doing when the corpus roughly doubles.

**Series indexes still hand-write their contents list.** `getSeries()`
already returns the parts in order; rendering the list from it would remove
the last place where series structure is maintained as prose.

**The Django `BlogPost` model, serializer and `/api/blog/` endpoints are
orphaned.** The frontend has never called them and now definitively will
not. They should be removed, or the content layer should be given a second
loader that reads them — but carrying an unused, untested API surface that
looks authoritative is the worst of the three.

**The README's "Project Structure" tree is stale.** It predates the v2
rewrite and lists components that no longer exist (`Hero.jsx`,
`TerminalCard.jsx`, `Skills.jsx`). This change adds `src/lib/content/` to
the list of things it does not mention.

**A dangling reference is gone.** The old `posts.js` opened with *"See
ADR-002 in README for why this stays static"*. There is no ADR section in
the README and never was. This document is, in effect, the record that
comment was pointing at.
