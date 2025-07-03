export async function resolve(specifier, context, nextResolve) {
  // Strip version from imports like "got@13.0.0" -> "got"
  const versionedImportMatch = specifier.match(/^(.+)@[\d\.\-\w]+$/);
  if (versionedImportMatch) {
    specifier = versionedImportMatch[1];
  }
  
  return nextResolve(specifier, context);
}