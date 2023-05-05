import { Pipedream } from "@pipedream/types";
import {
  ListFields, TweetFields, UserFields,
} from "./fields";

interface PdAxiosRequest {
  $: Pipedream;
}

interface PaginationParams {
  maxPerPage?: number;
  maxResults?: number;
}

interface PaginatedRequest extends PdAxiosRequest, PaginationParams {}

export interface HttpRequestParams extends PdAxiosRequest {
  url: string;
  method: string;
  data?: object | string;
  params?: object;
}

export interface PaginatedRequestParams
  extends HttpRequestParams,
    PaginationParams {}

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

interface ListId {
  listId: string;
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

export interface GetUserLikedTweetParams extends PaginatedRequest, UserId {
  params?: TweetFields;
}

export interface GetListTweetsParams extends PaginatedRequest, ListId {
  params?: TweetFields;
}

export interface GetUserOwnedListsParams extends PaginatedRequest, UserId {
  params?: ListFields;
}

export interface GetUserMentionsParams extends PaginatedRequest, UserId {
  params?: TweetFields;
}

export interface GetUserTweetsParams extends PaginatedRequest, UserId {
  params?: TweetFields & {
    since_id?: string;
  };
}

export interface GetUserFollowedListsParams extends PaginatedRequest, UserId {
  params?: ListFields;
}

export interface GetAuthenticatedUserParams extends PdAxiosRequest {
  params?: UserFields;
}

export interface GetUserParams extends GetAuthenticatedUserParams, UserId { }

export interface GetTweetParams extends PdAxiosRequest, TweetId {
  params?: TweetFields;
}

export interface GetUserFollowersParams extends PaginatedRequest, UserId {
  params?: UserFields;
}

export type GetUserFollowingParams = GetUserFollowersParams;

export interface LikeTweetParams extends PdAxiosRequest {
  data: {
    tweet_id: string;
  };
}
export type RetweetParams = LikeTweetParams;

export interface SearchTweetsParams extends PaginatedRequest {
  params: { query: string; };
}

export interface UnfollowUserParams extends PdAxiosRequest, UserId {}

export interface UnlikeTweetParams extends PdAxiosRequest, TweetId {}
