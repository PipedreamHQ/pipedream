import { Pipedream } from "@pipedream/types";
import {
  ListFields, MessageFields, TweetFields, UserFields,
} from "./fields";
import FormData from "form-data";

interface FallbackError {
  fallbackError?: string;
}

interface PdAxiosRequest {
  $: Pipedream;
}

interface PaginationParams {
  maxPerPage?: number;
  maxResults?: number;
}

interface PaginatedRequest extends PdAxiosRequest, PaginationParams { }

export interface HttpRequestParams extends PdAxiosRequest, FallbackError {
  url: string;
  method: string;
  headers?: object;
  data?: object | string;
  params?: object;
  baseURL?: string;
  specialAuth?: boolean;
  throwError?: boolean;
}

export interface PaginatedRequestParams
  extends HttpRequestParams,
  PaginationParams { }

export interface AddUserToListParams extends PdAxiosRequest, FallbackError {
  listId: string;
  data: {
    user_id: string;
  };
}

export interface CreateTweetParams extends PdAxiosRequest, FallbackError {
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

export interface DeleteTweetParams extends PdAxiosRequest, TweetId, FallbackError { }

export interface FollowUserParams extends PdAxiosRequest, FallbackError {
  data: {
    target_user_id: string;
  };
}

export interface GetDirectMessagesParams extends PaginatedRequest, FallbackError {
  params?: MessageFields & {
    event_types: "MessageCreate";
  };
}

export interface GetUserLikedTweetParams extends PaginatedRequest, UserId, FallbackError {
  params?: TweetFields;
}

export interface GetListTweetsParams extends PaginatedRequest, ListId, FallbackError {
  params?: TweetFields;
}

export interface GetUserOwnedListsParams extends PaginatedRequest, UserId, FallbackError {
  params?: ListFields;
}

export interface GetUserMentionsParams extends PaginatedRequest, UserId, FallbackError {
  params?: TweetFields;
}

export interface GetUserTweetsParams extends PaginatedRequest, UserId, FallbackError {
  params?: TweetFields & {
    since_id?: string;
  };
}

export interface GetUserFollowedListsParams extends PaginatedRequest, UserId, FallbackError {
  params?: ListFields;
}

export interface GetAuthenticatedUserParams extends PdAxiosRequest, FallbackError {
  params?: UserFields;
}

export interface GetUserParams extends GetAuthenticatedUserParams, UserId, FallbackError { }

export interface GetTweetParams extends PdAxiosRequest, TweetId, FallbackError {
  params?: TweetFields;
}

export interface GetUserFollowersParams extends PaginatedRequest, UserId, FallbackError {
  params?: UserFields;
}

export type GetUserFollowingParams = GetUserFollowersParams;

export interface LikeTweetParams extends PdAxiosRequest, FallbackError {
  data: {
    tweet_id: string;
  };
}
export type RetweetParams = LikeTweetParams;

export interface SearchTweetsParams extends PaginatedRequest, FallbackError {
  params: { query: string; };
}

export interface SendMessageParams extends PdAxiosRequest, UserId, FallbackError {
  data: {
    text: string;
  };
}

export interface UnfollowUserParams extends PdAxiosRequest, UserId, FallbackError { }

export interface UnlikeTweetParams extends PdAxiosRequest, TweetId, FallbackError { }

export interface UploadMediaParams extends PdAxiosRequest, FallbackError {
  data: FormData;
}
