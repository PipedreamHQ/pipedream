import {
  IncludesIdCollection,
  IncludesIdCollectionFlattened,
} from "./types/includeMapping";
import {
  DirectMessage,
  List,
  ResponseIncludes,
  Tweet,
  TwitterEntity,
  User,
} from "./types/responseSchemas";

// https://developer.twitter.com/en/docs/twitter-api/expansions

function flatClearIncludeIds(
  obj: IncludesIdCollection,
): IncludesIdCollectionFlattened {
  return Object.fromEntries(
    Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      value.filter((e) => e !== undefined).flat(),
    ]),
  );
}

export function getDirectMessageIncludeIds(obj: DirectMessage) {
  return flatClearIncludeIds({
    userIds: [
      obj.sender_id,
      obj.participant_ids,
    ],
    mediaKeys: [
      obj.attachments?.media_keys,
    ],
    tweetIds: [
      obj.referenced_tweets?.map(({ id }) => id),
    ],
  });
}

export function getListIncludeIds(obj: List) {
  return flatClearIncludeIds({
    userIds: [
      obj.owner_id,
    ],
  });
}

export function getUserIncludeIds(obj: User) {
  return flatClearIncludeIds({
    tweetIds: [
      obj.pinned_tweet_id,
    ],
  });
}

export function getTweetIncludeIds(obj: Tweet) {
  return flatClearIncludeIds({
    userIds: [
      obj.author_id,
      obj.in_reply_to_user_id,
    ],
    userNames: [
      obj.entities?.mentions?.map(({ username }) => username),
    ],
    tweetIds: [
      obj.edit_history_tweet_ids,
      obj.referenced_tweets?.map(({ id }) => id),
    ],
    pollIds: [
      obj.attachments?.poll_ids,
    ],
    placeIds: [
      obj.geo?.place_id,
    ],
    mediaKeys: [
      obj.attachments?.media_keys,
    ],
  });
}

export function getObjIncludes(
  obj: TwitterEntity,
  includes: ResponseIncludes = {},
  getIncludeIds: (o: TwitterEntity) => IncludesIdCollectionFlattened,
) {
  const {
    userIds, userNames, tweetIds, pollIds, placeIds, mediaKeys,
  } =
    getIncludeIds(obj);

  const result: ResponseIncludes = {
    media: includes.media?.filter((item) => mediaKeys?.includes(item.media_key)),
    users: includes.users?.filter(
      (item) => userIds?.includes(item.id) || userNames?.includes(item.username),
    ),
    places: includes.places?.filter((item) => placeIds?.includes(item.id)),
    polls: includes.polls?.filter((item) => pollIds?.includes(item.id)),
    tweets: includes.tweets?.filter((item) => tweetIds?.includes(item.id)),
  };
  return Object.fromEntries(
    Object.entries(result).filter(([
      , value,
    ]) => value?.length > 0),
  );
}
