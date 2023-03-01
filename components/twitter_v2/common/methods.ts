export async function getUserId(): Promise<string> {
  const { userNameOrId } = this;

  if (userNameOrId === "me") return this.app.getAuthenticatedUserId();

  return userNameOrId.startsWith("@")
    ? this.app.getUserByUsername(userNameOrId.slice(1))
    : userNameOrId;
}
