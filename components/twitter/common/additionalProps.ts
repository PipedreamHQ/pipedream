// This is no longer being used. Requests send all the available fields by default.
// If it ever makes sense to allow customizing which fields are sent, this can be re-enabled
/*
import {
  LIST_FIELD_OPTIONS,
  MEDIA_FIELD_OPTIONS,
  PLACE_FIELD_OPTIONS,
  POLL_FIELD_OPTIONS,
  TWEET_FIELD_OPTIONS,
  USER_FIELD_OPTIONS,
} from "./dataFields";
import {
  LIST_EXPANSION_OPTIONS,
  TWEET_EXPANSION_OPTIONS,
  USER_EXPANSION_OPTIONS,
} from "./expansions";

// These cannot be propDefinitions in the app file, because additionalProps() needs them to be primitives
const listExpansions = {
  type: "string[]",
  label: "Expansions",
  optional: true,
  description:
    "Additional data objects related to the List(s) to be included in the response.",
  options: LIST_EXPANSION_OPTIONS,
};
const tweetExpansions = {
  type: "string[]",
  label: "Expansions",
  optional: true,
  description:
    "Additional data objects related to the Tweet(s) to be included in the response.",
  options: TWEET_EXPANSION_OPTIONS,
};
const userExpansions = {
  type: "string[]",
  label: "Expansions",
  optional: true,
  description:
    "Additional data objects related to the User(s) to be included in the response.",
  options: USER_EXPANSION_OPTIONS,
};
const listFields = {
  type: "string[]",
  label: "List Fields",
  description:
    "Specific [list fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/lists) to be included in the returned list object.",
  optional: true,
  options: LIST_FIELD_OPTIONS,
};
const mediaFields = {
  type: "string[]",
  label: "Media Fields",
  description:
    "Specific [media fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media) to be included in the returned Tweet(s). Only applicable if the Tweet contains media and you've requested the `attachments.media_keys` expansion.",
  optional: true,
  options: MEDIA_FIELD_OPTIONS,
};
const placeFields = {
  type: "string[]",
  label: "Place Fields",
  description:
    "Specific [place fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/place) to be included in the returned Tweet(s). Only applicable if the Tweet contains a place and you've requested the `geo.place_id` expansion.",
  optional: true,
  options: PLACE_FIELD_OPTIONS,
};
const pollFields = {
  type: "string[]",
  label: "Poll Fields",
  description:
    "Specific [poll fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/poll) to be included in the returned Tweet(s). Only applicable if the Tweet contains a poll and you've requested the `attachments.poll_ids` expansion.",
  optional: true,
  options: POLL_FIELD_OPTIONS,
};
const tweetFields = {
  type: "string[]",
  label: "Tweet Fields",
  description:
    "Specific [tweet fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet) to be included in the returned Tweet(s). If you've requested the `referenced_tweets.id` expansion, these fields will also be returned for any included referenced Tweets.",
  optional: true,
  options: TWEET_FIELD_OPTIONS,
};
const userFields = {
  type: "string[]",
  label: "User Fields",
  description:
    "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned Tweet(s). Only applicable if you've requested one of the user expansions: `author_id`, `entities.mentions.username`, `in_reply_to_user_id`, `referenced_tweets.id.author_id`.",
  optional: true,
  options: USER_FIELD_OPTIONS,
};

// The 'any' here is needed because of the additionalProps behavior

export async function listAdditionalProps(): Promise<Record<string, any>> {
  return this.includeAllFields === false
    ? {
      expansions: listExpansions,
      listFields,
      userFields: {
        ...userFields,
        description:
            "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned user object. Only applicable if you've requested the `owner_id` expansion.",
      },
    }
    : {};
}

export async function tweetAdditionalProps(): Promise<Record<string, any>> {
  return this.includeAllFields === false
    ? {
      expansions: tweetExpansions,
      mediaFields,
      placeFields,
      pollFields,
      tweetFields,
      userFields,
    }
    : {};
}

export async function userAdditionalProps(): Promise<Record<string, any>> {
  return this.includeAllFields === false
    ? {
      expansions: userExpansions,
      tweetFields: {
        ...tweetFields,
        description:
            "Specific [tweet fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet) to be included in the returned pinned Tweet. Only applicable if the user has a pinned Tweet and you've requested the `referenced_tweets.id` expansion.",
      },
      userFields: {
        ...userFields,
        description:
            "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned user object.",
      },
    }
    : {};
}
*/
