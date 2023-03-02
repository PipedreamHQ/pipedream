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

export function getListFields() {
  const {
    expansions, listFields, userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": expansions?.join(),
    "list.fields": listFields?.join(),
    "user.fields": userFields?.join(),
  };
}

export function getTweetFields() {
  const {
    expansions,
    mediaFields,
    placeFields,
    pollFields,
    tweetFields,
    userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": expansions?.join(),
    "media.fields": mediaFields?.join(),
    "place.fields": placeFields?.join(),
    "poll.fields": pollFields?.join(),
    "tweet.fields": tweetFields?.join(),
    "user.fields": userFields?.join(),
  };
}

export function getUserFields() {
  const {
    expansions, tweetFields, userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": expansions?.join(),
    "tweet.fields": tweetFields?.join(),
    "user.fields": userFields?.join(),
  };
}
