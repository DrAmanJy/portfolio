import Projects from "../models/projects.js";

export function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-") // remove duplicate hyphens
    .replace(/^-|-$/g, ""); // trim hyphens
}

export async function createUniqueSlug(name) {
  let slug = generateSlug(name);
  let i = 1;

  while (await Projects.exists({ slug })) {
    slug = `${name}-${i++}`;
  }
  return slug;
}
