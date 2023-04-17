import { ConfigurationError } from "@pipedream/platform";
import { LIST_FIELD_OPTIONS, MEDIA_FIELD_OPTIONS, PLACE_FIELD_OPTIONS, POLL_FIELD_OPTIONS, TWEET_FIELD_OPTIONS, USER_FIELD_OPTIONS } from "./dataFields";
import { LIST_EXPANSION_OPTIONS, USER_EXPANSION_OPTIONS } from "./expansions";

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
    "expansions": (expansions ?? LIST_EXPANSION_OPTIONS).join(),
    "list.fields": (listFields ?? LIST_FIELD_OPTIONS).join(),
    "user.fields": (userFields ?? USER_FIELD_OPTIONS).join(),
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
    "expansions": (expansions ?? LIST_EXPANSION_OPTIONS).join(),
    "media.fields": (mediaFields ?? MEDIA_FIELD_OPTIONS).join(),
    "place.fields": (placeFields ?? PLACE_FIELD_OPTIONS).join(),
    "poll.fields": (pollFields ?? POLL_FIELD_OPTIONS).join(),
    "tweet.fields": (tweetFields ?? TWEET_FIELD_OPTIONS).join(),
    "user.fields": (userFields ?? USER_FIELD_OPTIONS).join(),
  };
}

export function getUserFields() {
  const {
    expansions, tweetFields, userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": (expansions ?? USER_EXPANSION_OPTIONS).join(),
    "tweet.fields": (tweetFields ?? TWEET_FIELD_OPTIONS).join(),
    "user.fields": (userFields ?? USER_FIELD_OPTIONS).join(),
  };
}
