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

export function getRelevantHeaders(headers = {}) {
  return Object.keys(headers)?.length
    ? {
      github_headers: {
        "x-github-delivery": headers["x-github-delivery"],
        "x-github-event": headers["x-github-event"],
        "x-github-hook-id": headers["x-github-hook-id"],
      },
    }
    : {};
}
