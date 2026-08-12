import { projects } from '../data/projects.js'

// "REIGN OF ELEMENTS" -> "reign-of-elements". Derived from the name rather
// than stored as its own field, so there's one source of truth — adding a
// project never risks the slug and the name drifting out of sync.
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugForProject(project) {
  return slugify(project.name)
}

// Built once at module load, not on every lookup.
const bySlug = new Map(projects.map(p => [slugForProject(p), p]))

export function projectForSlug(slug) {
  return bySlug.get(slug) ?? null
}
