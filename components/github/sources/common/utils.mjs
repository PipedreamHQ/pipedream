export async function checkAdminPermission() {
  const { repoFullname } = this;
  const { login: username } = await this.github.getAuthenticatedUser();
  const { user: { permissions: { admin } } } = await this.github.getUserRepoPermissions({
    repoFullname,
    username,
  });
  return admin;
}

export async function checkOrgAdminPermission() {
  const { org } = this;
  const { login: username } = await this.github.getAuthenticatedUser();
  const { role } = await this.github.getOrgUserInfo({
    org,
    username,
  });
  return role === "admin";
}
