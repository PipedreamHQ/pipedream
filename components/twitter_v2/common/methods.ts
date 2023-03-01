export async function getUserId(): Promise<string> {
  const { userNameOrId } = this;

  let id = userNameOrId;

  if (userNameOrId === "me") {
    id = await this.app.getAuthenticatedUserId();
  } else if (userNameOrId.startsWith("@")) {
    id = await this.app.getUserByUsername(userNameOrId.slice(1));
  }

  if (!id) throw new Error("User not found");

  return id;
}
