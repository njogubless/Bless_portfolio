import { parseFrontmatter } from './frontmatter'
import { validate } from './schema'

/**
 * Builds a typed, validated collection from a set of raw markdown files.
 *
 * This is the reusable piece: it knows nothing about blog posts. Give it
 * raw file contents, a schema and a transform and it hands back a frozen,
 * deduplicated, sorted collection. Notes, talks or case studies would each
 * be a few lines here rather than another bespoke data file.
 *
 * Files with no frontmatter block are skipped. That is the opt-in rule —
 * a markdown file under the content roots becomes published content by
 * gaining frontmatter, so internal notes and READMEs can sit alongside
 * articles without a list of exclusions to maintain. A file that *has*
 * frontmatter but gets it wrong still throws.
 *
 * @param {object}   config
 * @param {string}   config.name       Collection name, used in error messages.
 * @param {object}   config.sources    Map of file path -> raw file contents.
 * @param {object}   config.schema     Field validators, see ./schema.
 * @param {Function} config.transform  (entry, allEntries) -> item
 * @param {string}   [config.key]      Item property used as the unique key.
 * @param {Function} [config.sort]     Comparator applied to the final items.
 */
export function defineCollection({ name, sources, schema, transform, key = 'slug', sort }) {
  // Pass 1: parse and validate every file. Done up front so that a transform
  // (for example, link rewriting) can see the whole collection.
  const entries = []
  for (const path of Object.keys(sources).sort()) {
    const raw = sources[path]
    const { data, body } = parseFrontmatter(raw, path)
    if (data === null) continue
    entries.push({ path, data: validate(schema, data, path), body })
  }

  if (entries.length === 0) {
    throw new Error(`Content collection "${name}" is empty — check the glob pattern`)
  }

  // Pass 2: build the public items.
  const items = entries.map((entry) => Object.freeze(transform(entry, entries)))

  const byKey = new Map()
  for (const item of items) {
    const id = item[key]
    if (byKey.has(id)) {
      throw new Error(
        `Duplicate ${key} "${id}" in collection "${name}": ` +
          `${byKey.get(id).sourcePath} and ${item.sourcePath}`
      )
    }
    byKey.set(id, item)
  }

  const sorted = Object.freeze(sort ? [...items].sort(sort) : items)

  return {
    name,
    /** Every item, in collection order. */
    all: () => sorted,
    /** One item by key, or undefined. */
    get: (id) => byKey.get(id),
    has: (id) => byKey.has(id),
    /** Items matching a predicate, preserving collection order. */
    filter: (predicate) => sorted.filter(predicate),
    /** Distinct values of a field across the collection, in first-seen order. */
    distinct: (prop) => [...new Set(sorted.map((item) => item[prop]).filter(Boolean))],
  }
}
