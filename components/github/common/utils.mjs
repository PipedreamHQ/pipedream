/**
 * A utility function that accepts a string as an argument and reformats it in
 * order to remove newline characters and consecutive spaces. Useful when
 * dealing with very long templated strings that are split into multiple lines.
 *
 * @example
 * // returns "This is a much cleaner string"
 * toSingleLineString(`
 *   This is a much
 *   cleaner string
 * `);
 *
 * @param {string} multiLineString the input string to reformat
 * @returns a formatted string based on the content of the input argument,
 * without newlines and multiple spaces
 */
export function toSingleLineString(multiLineString) {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
}

async function getUserRepoPermissions(github, repoFullname) {
  const { login: username } = await github.getAuthenticatedUser();
  const { user: { permissions } } = await github.getUserRepoPermissions({
    repoFullname,
    username,
  });
  return permissions;
}

export async function checkAdminPermission() {
  const {
    github, repoFullname,
  } = this;
  const { admin } = await getUserRepoPermissions(github, repoFullname);
  return admin;
}

export async function checkPushPermission() {
  const {
    github, repoFullname,
  } = this;
  const { push } = await getUserRepoPermissions(github, repoFullname);
  return push;
}
