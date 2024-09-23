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
