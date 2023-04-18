import { ConfigurationError } from "@pipedream/platform";
import {
  LIST_FIELD_OPTIONS, MEDIA_FIELD_OPTIONS, PLACE_FIELD_OPTIONS, POLL_FIELD_OPTIONS, TWEET_FIELD_OPTIONS, USER_FIELD_OPTIONS,
} from "./dataFields";
import {
  LIST_EXPANSION_OPTIONS, USER_EXPANSION_OPTIONS,
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
  const {
    includeAllFields, expansions, listFields, userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": (includeAllFields ? LIST_EXPANSION_OPTIONS : expansions).join(),
    "list.fields": (includeAllFields ? LIST_FIELD_OPTIONS : listFields).join(),
    "user.fields": (includeAllFields ? USER_FIELD_OPTIONS : userFields).join(),
  };
}

export function getTweetFields() {
  const {
    includeAllFields,
    expansions,
    mediaFields,
    placeFields,
    pollFields,
    tweetFields,
    userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": (includeAllFields ? LIST_EXPANSION_OPTIONS : expansions).join(),
    "media.fields": (includeAllFields ? MEDIA_FIELD_OPTIONS : mediaFields).join(),
    "place.fields": (includeAllFields ? PLACE_FIELD_OPTIONS : placeFields).join(),
    "poll.fields": (includeAllFields ? POLL_FIELD_OPTIONS : pollFields).join(),
    "tweet.fields": (includeAllFields ? TWEET_FIELD_OPTIONS : tweetFields).join(),
    "user.fields": (includeAllFields ? USER_FIELD_OPTIONS : userFields).join(),
  };
}

export function getUserFields() {
  const {
    includeAllFields, expansions, tweetFields, userFields,
  }: Record<string, string[]> = this;
  return {
    "expansions": (includeAllFields ? USER_EXPANSION_OPTIONS : expansions).join(),
    "tweet.fields": (includeAllFields ? TWEET_FIELD_OPTIONS : tweetFields).join(),
    "user.fields": (includeAllFields ? USER_FIELD_OPTIONS : userFields).join(),
  };
}
