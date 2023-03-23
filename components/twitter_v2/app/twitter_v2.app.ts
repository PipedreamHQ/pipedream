import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddUserToListParams,
  CreateTweetParams,
  DeleteTweetParams,
  FollowUserParams,
  GetUserLikedTweetParams,
  GetUserOwnedListsParams,
  GetTweetParams,
  GetUserFollowedListsParams,
  GetUserMentionsParams,
  GetUserParams,
  GetUserTweetsParams,
  HttpRequestParams,
  LikeTweetParams,
  GetUserFollowersParams,
  GetUserFollowingParams,
  PaginatedRequestParams,
  RetweetParams,
  SearchTweetsParams,
  UnfollowUserParams,
  UnlikeTweetParams,
  GetListTweetsParams,
} from "../common/types/requestParams";
import {
  LIST_FIELD_OPTIONS,
  MEDIA_FIELD_OPTIONS, PLACE_FIELD_OPTIONS, POLL_FIELD_OPTIONS, TWEET_FIELD_OPTIONS, USER_FIELD_OPTIONS,
} from "../common/dataFields";
import {
  TWEET_EXPANSION_OPTIONS, USER_EXPANSION_OPTIONS,
} from "../common/expansions";
import {
  List, PaginatedResponse, Tweet, TwitterEntity, User,
} from "../common/types/responseSchemas";

export default defineApp({
  type: "app",
  app: "twitter_v2",
  propDefinitions: {
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum total amount of items to return. The maximum amount of requests that can be made is 5.",
      optional: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "Select a **List** owned by the authenticated user, or use a custom *List ID*.",
      async options() {
        const userId = this.getAuthenticatedUser();
        const lists: List[] = await this.getUserOwnedLists({
          userId,
        });
        return lists.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    userNameOrId: {
      type: "string",
      label: "User Name or ID",
      description:
        "A Twitter username (handle) prefixed with `@` (e.g. `@pipedream`). You can also use the string `me` to use the authenticated user, or reference a numeric User ID from a previous step.",
    },
    tweetId: {
      type: "string",
      label: "Tweet ID",
      description: "The numerical ID of the tweet (also known as \"status\")",
    },
    query: {
      type: "string",
      label: "Query",
      description: "One query for matching Tweets. See the [Twitter API guide on building queries](https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query).",
    },
    tweetExpansions: {
      type: "string[]",
      label: "Expansions",
      optional: true,
      description:
        "Additional data objects related to the Tweet(s) to be included in the response.",
      options: TWEET_EXPANSION_OPTIONS,
    },
    userExpansions: {
      type: "string[]",
      label: "Expansions",
      optional: true,
      description:
        "Additional data objects related to the User(s) to be included in the response.",
      options: USER_EXPANSION_OPTIONS,
    },
    listFields: {
      type: "string[]",
      label: "List Fields",
      description:
        "Specific [list fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/lists) to be included in the returned list object.",
      optional: true,
      options: LIST_FIELD_OPTIONS,
    },
    mediaFields: {
      type: "string[]",
      label: "Media Fields",
      description:
        "Specific [media fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media) to be included in the returned Tweet(s). Only applicable if the Tweet contains media and you've requested the `attachments.media_keys` expansion.",
      optional: true,
      options: MEDIA_FIELD_OPTIONS,
    },
    placeFields: {
      type: "string[]",
      label: "Place Fields",
      description:
        "Specific [place fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/place) to be included in the returned Tweet(s). Only applicable if the Tweet contains a place and you've requested the `geo.place_id` expansion.",
      optional: true,
      options: PLACE_FIELD_OPTIONS,
    },
    pollFields: {
      type: "string[]",
      label: "Poll Fields",
      description:
        "Specific [poll fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/poll) to be included in the returned Tweet(s). Only applicable if the Tweet contains a poll and you've requested the `attachments.poll_ids` expansion.",
      optional: true,
      options: POLL_FIELD_OPTIONS,
    },
    tweetFields: {
      type: "string[]",
      label: "Tweet Fields",
      description:
        "Specific [tweet fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet) to be included in the returned Tweet(s). If you've requested the `referenced_tweets.id` expansion, these fields will also be returned for any included referenced Tweets.",
      optional: true,
      options: TWEET_FIELD_OPTIONS,
    },
    userFields: {
      type: "string[]",
      label: "User Fields",
      description:
        "Specific [user fields](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user) to be included in the returned Tweet(s). Only applicable if you've requested one of the user expansions: `author_id`, `entities.mentions.username`, `in_reply_to_user_id`, `referenced_tweets.id.author_id`.",
      optional: true,
      options: USER_FIELD_OPTIONS,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitter.com/2";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._getBaseUrl(),
        headers: this._getHeaders(),
        ...args,
      });
    },
    async _paginatedRequest({
      maxResults = 100, maxPerPage = 100, params, ...args
    }: PaginatedRequestParams): Promise<TwitterEntity[]> {
      const result = [];
      let paginationToken: string;
      let resultCount = 0;

      do {
        const perPage = Math.min(maxResults - resultCount, maxPerPage);

        const { data, meta: { next_token } }: PaginatedResponse = await this._httpRequest({
          params: {
            ...params,
            max_results: perPage,
            pagination_token: paginationToken,
          },
          ...args,
        });

        if (!data) break;
        result.push(...(Array.isArray(data) ? data : [data]));
        paginationToken = next_token;
        resultCount += perPage;
      } while (paginationToken && resultCount < maxResults);

      return result;
    },
    async addUserToList({
      listId, ...args
    }: AddUserToListParams): Promise<object> {
      const response = await this._httpRequest({
        method: "POST",
        url: `/lists/${listId}/members`,
        ...args,
      });
      return response.data;
    },
    async createTweet(args: CreateTweetParams): Promise<object> {
      const response = await this._httpRequest({
        method: "POST",
        url: "/tweets",
        ...args,
      });
      return response.data;
    },
    async deleteTweet({
      tweetId, ...args
    }: DeleteTweetParams): Promise<object> {
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/tweets/${tweetId}`,
        ...args,
      });
      return response.data;
    },
    async followUser(args: FollowUserParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/following`,
        ...args,
      });
      return response.data;
    },
    async getListTweets({
      listId, ...args
    }: GetListTweetsParams): Promise<Tweet[]> {
      return this._paginatedRequest({
        url: `/lists/${listId}/tweets`,
        ...args,
      });
    },
    async getTweet({
      tweetId, ...args
    }: GetTweetParams): Promise<Tweet> {
      const response = await this._httpRequest({
        url: `/tweets/${tweetId}`,
        ...args,
      });
      return response.data;
    },
    async getAuthenticatedUserId(): Promise<User["id"]> {
      const response = await this._httpRequest({
        url: "/users/me",
      });
      return response.data.id;
    },
    async getUserLikedTweets({
      userId, ...args
    }: GetUserLikedTweetParams): Promise<Tweet[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/liked_tweets`,
        ...args,
      });
    },
    async getUserOwnedLists({
      userId, ...args
    }: GetUserOwnedListsParams): Promise<List[]> {
      const response = await this._httpRequest({
        url: `/users/${userId}/owned_lists`,
        ...args,
      });
      return response.data;
    },
    async getUserFollowedLists({
      userId, ...args
    }: GetUserFollowedListsParams): Promise<List[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/followed_lists`,
        ...args,
      });
    },
    async getUserMentions({
      userId, ...args
    }: GetUserMentionsParams): Promise<Tweet[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/mentions`,
        ...args,
      });
    },
    async getUserTweets({
      userId, ...args
    }: GetUserTweetsParams): Promise<Tweet[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/tweets`,
        ...args,
      });
    },
    async getUserByUsername(username: string): Promise<User> {
      const response = await this._httpRequest({
        url: `/users/by/username/${username}`,
      });
      return response.data;
    },
    async getUser({
      userId, ...args
    }: GetUserParams): Promise<User> {
      const response = await this._httpRequest({
        url: `/users/${userId}`,
        ...args,
      });
      return response.data;
    },
    async likeTweet(args: LikeTweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/likes`,
        ...args,
      });
      return response.data;
    },
    async getUserFollowers({
      userId, ...args
    }: GetUserFollowersParams): Promise<User[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/followers`,
        ...args,
      });
    },
    async getUserFollowing({
      userId, ...args
    }: GetUserFollowingParams): Promise<User[]> {
      return this._paginatedRequest({
        url: `/users/${userId}/following`,
        ...args,
      });
    },
    async retweet(args: RetweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/retweets`,
        ...args,
      });
      return response.data;
    },
    async searchTweets(
      args
    : SearchTweetsParams,
    ): Promise<Tweet[]> {
      const response = await this._paginatedRequest({
        url: "/tweets/search/recent",
        ...args,
      });
      return response.data;
    },
    async unfollowUser({
      userId, ...args
    }: UnfollowUserParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/following/${userId}`,
        ...args,
      });
      return response.data;
    },
    async unlikeTweet({
      tweetId, ...args
    }: UnlikeTweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/likes/${tweetId}`,
        ...args,
      });
      return response.data;
    },
  },
});
