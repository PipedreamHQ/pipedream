export async function getUserId(): Promise<string> {
  const { userNameOrId } = this;
  return userNameOrId.startsWith("@")
    ? this.app.getUserByUsername(userNameOrId.slice(1))
    : userNameOrId;
}
