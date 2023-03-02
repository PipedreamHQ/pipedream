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

export function getTweetFields() {
  return {
    "expansions": this.expansions?.join(),
    "media.fields": this.mediaFields?.join(),
    "place.fields": this.placeFields?.join(),
    "poll.fields": this.pollFields?.join(),
    "tweet.fields": this.tweetFields?.join(),
    "user.fields": this.userFields?.join(),
  };
}

export function getUserFields() {
  return {
    "expansions": this.expansions?.join(),
    "tweet.fields": this.tweetFields?.join(),
    "user.fields": this.userFields?.join(),
  };
}
