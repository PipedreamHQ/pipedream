export async function resolve(specifier, context, nextResolve) {
  // Strip Pipedream's version-pinned import syntax: "got@13.0.0" -> "got".
  // The leading "@" of a scoped package is not a version separator, so only
  // look for a "@<digit>..." suffix after it.
  const versionedImportMatch = specifier.match(/^(@?[^@]+)@\d[^/]*$/);
  if (!versionedImportMatch) {
    return nextResolve(specifier, context);
  }

  try {
    return await nextResolve(versionedImportMatch[1], context);
  } catch (error) {
    // The "@" wasn't a version pin after all - resolve the specifier as-is.
    return nextResolve(specifier, context);
  }
}
