import { ConfigurationError } from "@pipedream/platform";
import {
  LIST_FIELD_OPTIONS, MEDIA_FIELD_OPTIONS, PLACE_FIELD_OPTIONS, POLL_FIELD_OPTIONS, TWEET_FIELD_OPTIONS, USER_FIELD_OPTIONS,
} from "./dataFields";
import {
  LIST_EXPANSION_OPTIONS, TWEET_EXPANSION_OPTIONS, USER_EXPANSION_OPTIONS,
} from "./expansions";

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
  // See comment on "../common/additionalProps.ts"
  /*
  const {
    includeAllFields, expansions, listFields, userFields,
  }: Record<string, string[]> = this;
  */
  return {
    "expansions": LIST_EXPANSION_OPTIONS.join(),
    "list.fields": LIST_FIELD_OPTIONS.join(),
    "user.fields": USER_FIELD_OPTIONS.join(),
  };
}

export function getTweetFields() {
  /*
  const {
    includeAllFields,
    expansions,
    mediaFields,
    placeFields,
    pollFields,
    tweetFields,
    userFields,
  }: Record<string, string[]> = this;
  */
  return {
    "expansions": TWEET_EXPANSION_OPTIONS.join(),
    "media.fields": MEDIA_FIELD_OPTIONS.join(),
    "place.fields": PLACE_FIELD_OPTIONS.join(),
    "poll.fields": POLL_FIELD_OPTIONS.join(),
    "tweet.fields": TWEET_FIELD_OPTIONS.join(),
    "user.fields": USER_FIELD_OPTIONS.join(),
  };
}

export function getUserFields() {
  /*
  const {
    includeAllFields, expansions, tweetFields, userFields,
  }: Record<string, string[]> = this;
  */
  return {
    "expansions": USER_EXPANSION_OPTIONS.join(),
    "tweet.fields": TWEET_FIELD_OPTIONS.join(),
    "user.fields": USER_FIELD_OPTIONS.join(),
  };
}
