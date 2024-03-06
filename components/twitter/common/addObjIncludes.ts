import { IncludesIdCollection } from "./types/includeMapping";
import {
  DirectMessage,
  List,
  ResponseIncludes,
  Tweet,
  TwitterEntity,
  User,
} from "./types/responseSchemas";

// https://developer.twitter.com/en/docs/twitter-api/expansions

function flatClearIncludeIds(obj: IncludesIdCollection) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value.filter((e) => e !== undefined).flat(),
    ])
  );
}

function getDirectMessageIncludeIds(obj: DirectMessage) {
  return flatClearIncludeIds({
    userIds: [obj.sender_id, obj.participant_ids],
    mediaKeys: [obj.attachments?.media_keys],
    tweetIds: [obj.referenced_tweets?.map(({ id }) => id)],
  });
}

function getListIncludeIds(obj: List) {
  return flatClearIncludeIds({
    userIds: [obj.owner_id],
  });
}

function getUserIncludeIds(obj: User) {
  return flatClearIncludeIds({
    tweetIds: [obj.pinned_tweet_id],
  });
}

function getTweetIncludeIds(obj: Tweet) {
  return flatClearIncludeIds({
    userIds: [obj.author_id, obj.in_reply_to_user_id],
    userNames: [obj.entities?.mentions?.map(({ username }) => username)],
    tweetIds: [
      obj.edit_history_tweet_ids,
      obj.referenced_tweets?.map(({ id }) => id),
    ],
    pollIds: [obj.attachments?.poll_ids],
    placeIds: [obj.geo?.place_id],
    mediaKeys: [obj.attachments?.media_keys],
  });
}

export function getTweetIncludes(obj: Tweet, includes: ResponseIncludes) {
  const result: ResponseIncludes = {};

  const { userIds, userNames, tweetIds, pollIds, placeIds, mediaKeys } =
    getTweetIncludeIds(obj);

  result.media = includes.media?.filter((item) =>
    mediaKeys.includes(item.media_key)
  );
  result.users = includes.users?.filter(
    (item) => userIds.includes(item.id) || userNames.includes(item.username)
  );
  result.places = includes.places?.filter((item) => placeIds.includes(item.id));
  result.polls = includes.polls?.filter((item) => pollIds.includes(item.id));
  result.tweets = includes.tweets?.filter((item) => tweetIds.includes(item.id));

  return Object.fromEntries(
    Object.entries(result).filter(([, value]) => value?.length > 0)
  );
}
