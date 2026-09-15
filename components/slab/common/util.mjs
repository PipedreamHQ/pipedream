export function pickFields(post, fields) {
  if (!fields?.length) {
    return post;
  }
  return Object.fromEntries(
    Object.entries(post).filter(([
      key,
    ]) => fields.includes(key)),
  );
}

/**
 * Slab derives a post's displayed title from the first line of its content delta —
 * there is no independent title field after creation. Sums the length of a
 * stringified delta's insert ops so new content can be appended (via a leading
 * `retain`) without overwriting that first line.
 */
export function deltaLength(content) {
  try {
    const ops = JSON.parse(content);
    return ops.reduce((sum, op) => sum + (typeof op.insert === "string"
      ? op.insert.length
      : 1), 0);
  } catch {
    return 0;
  }
}
