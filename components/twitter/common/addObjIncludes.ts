import { ResponseIncludes, TwitterEntity } from "./types/responseSchemas";

// https://developer.twitter.com/en/docs/twitter-api/expansions

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
