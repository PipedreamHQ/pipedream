import { ResponseIncludes, Tweet, TwitterEntity } from "./types/responseSchemas";

// https://developer.twitter.com/en/docs/twitter-api/expansions

export function getTweetIncludes(obj: Tweet, includes: ResponseIncludes) {
  const userIds = [
    obj.author_id,
    obj.in_reply_to_user_id,
  ];

  const userNames = [
    obj.entities?.mentions?.map(({ username }) => username)
  ]

  const tweetIds = [
    obj.edit_history_tweet_ids,
    obj.referenced_tweets?.map(({ id }) => id),
  ]

  const pollIds = [
    obj.attachments?.poll_ids,
  ]

  const placeIds = [
    obj.geo?.place_id,
  ]

  const mediaKeys = [
    obj.attachments?.media_keys,
  ]
  
  //.filter(e => e !== undefined).flat();
}

export function getObjIncludes(obj: TwitterEntity, includes: ResponseIncludes) {
  const result: ResponseIncludes = {};

  // const mediaKeys = obj.attachments?.media_keys;
  // if (mediaKeys) {
  //   result.media = includes.media?.filter((item) =>
  //     mediaKeys.includes(item.media_key)
  //   );
  // }

  // const referencedTweets = obj.referenced_tweets?.map(({id}) => id);
  // if (referencedTweets) {
  //   result.tweets = includes.tweets?.filter((item) =>
  //     referencedTweets.includes(item.id)
  //   );
  // }

  return result;
}
