import { Pipedream } from "@pipedream/types";
import {
  ListFields, TweetFields, UserFields,
} from "./fields";

interface PdAxiosRequest {
  $: Pipedream;
}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  data?: object | string;
  params?: object;
}

export interface AddUserToListParams extends PdAxiosRequest {
  listId: string;
  data: {
    user_id: string;
  };
}

export interface CreateTweetParams extends PdAxiosRequest {
  data: {
    text: string;
    geo?: {
      place_id: string;
    };
    media?: {
      media_ids: string[];
      tagged_user_ids: string[];
    };
    reply?: {
      exclude_reply_user_ids: string[];
      in_reply_to_tweet_id: string;
    };
  };
}

interface UserId {
  userId: string;
}
interface TweetId {
  tweetId: string;
}

export interface DeleteTweetParams extends PdAxiosRequest, TweetId {}

export interface FollowUserParams extends PdAxiosRequest {
  data: {
    target_user_id: string;
  };
}

export interface GetLikedTweetParams extends PdAxiosRequest, UserId {
  params: TweetFields;
}

export interface GetOwnedListsParams extends PdAxiosRequest, UserId {
  params?: ListFields;
}

export interface GetUserMentionsParams extends PdAxiosRequest, UserId {
  params: TweetFields;
}

export interface GetUserTweetsParams extends PdAxiosRequest, UserId {
  params: TweetFields;
}

export interface GetUserParams extends PdAxiosRequest, UserId {
  params: UserFields;
}

export interface GetTweetParams extends PdAxiosRequest, TweetId {
  params: TweetFields;
}

export interface ListFollowersParams extends PdAxiosRequest, UserId {
  params: UserFields;
}

export interface LikeTweetParams extends PdAxiosRequest {
  data: {
    tweet_id: string;
  };
}
export type RetweetParams = LikeTweetParams;

export interface SearchTweetsParams extends PdAxiosRequest {
  params: {query: string;};
}

export interface UnfollowUserParams extends PdAxiosRequest, UserId {}

export interface UnlikeTweetParams extends PdAxiosRequest, TweetId {}
