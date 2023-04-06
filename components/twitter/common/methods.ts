import { ConfigurationError } from "@pipedream/platform";

export async function getUserId(): Promise<string> {
  let { userNameOrId: id } = this;

  if (id === "me" || id === undefined) {
    id = await this.app.getAuthenticatedUserId();
  } else if (id.startsWith("@")) {
    const userData = await this.app.getUserByUsername(id.slice(1));
    id = userData?.data?.id;
    if (!id) throw new ConfigurationError("**User not found!** Check the `User Name or ID` prop.");
  }

  return id;
}

export function getMultiItemSummary(name: string, length: number) {
  return length
    ? `Successfully obtained ${length} ${name}${length === 1
      ? ""
      : "s"}`
    : `No ${name}s were found`;
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
