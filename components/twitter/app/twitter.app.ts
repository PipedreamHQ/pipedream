import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { defineApp } from "@pipedream/types";
import {
  axios, transformConfigForOauth, ConfigurationError,
} from "@pipedream/platform";
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
  GetAuthenticatedUserParams,
  SendMessageParams,
  GetDirectMessagesParams,
  UploadMediaParams,
} from "../common/types/requestParams";
import {
  DirectMessage,
  List,
  PaginatedResponseObject,
  ResponseObject,
  Tweet,
  TwitterEntity,
  User,
} from "../common/types/responseSchemas";
import {
  ERROR_MESSAGE, PROBLEM_TYPE,
} from "../common/errorMessage";

export default defineApp({
  type: "app",
  app: "twitter",
  propDefinitions: {
    maxResults: {
      type: "integer",
      label: "Max Results",
      description:
        "Maximum amount of items to return. The maximum amount per request for each endpoint is included in the API documentation.",
      optional: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description:
        "Select a **List** owned by the authenticated user, or use a custom *List ID*.",
      async options(): Promise<{ label: string; value: string; }[]> {
        try {
          const userId = await this.getAuthenticatedUserId();
          const lists = await this.getUserOwnedLists({
            userId,
          });

          return (
            lists.data?.map(({
              id, name,
            }: List) => ({
              label: name,
              value: id,
            })) ?? []
          );
        } catch (error) {
          throw new Error(ERROR_MESSAGE);
        }
      },
    },
    userNameOrId: {
      type: "string",
      label: "User Name or ID",
      description:
        "A Twitter username (handle) prefixed with `@` (e.g. `@pipedream`). You can also use the string `me` to use the authenticated user (default), or a numeric User ID.",
      optional: true,
      default: "me",
    },
    // See comment on "../common/additionalProps.ts"
    /*
    includeAllFields: {
      type: "boolean",
      label: "Include All Metadata",
      description: "If set to `false`, you can choose which fields will be returned for each data type.",
      optional: true,
      default: true,
      reloadProps: true,
    },
    */
    tweetId: {
      type: "string",
      label: "Tweet ID",
      description: "The numerical ID of the tweet.",
    },
    query: {
      type: "string",
      label: "Query",
      description:
        "One query for matching Tweets. See the [Twitter API guide on building queries](https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query).",
    },
  },
  methods: {
    throwError(data) {
      const errorMessage = PROBLEM_TYPE[data?.type];
      if (!errorMessage) {
        return;
      }
      const stringifiedData = JSON.stringify(data);
      throw new ConfigurationError(`${errorMessage} \`${stringifiedData}\``);
    },
    _getAuthHeader(config: HttpRequestParams) {
      const {
        developer_consumer_key: devKey,
        developer_consumer_secret: devSecret,
        oauth_access_token: key,
        oauth_refresh_token: secret,
      } = this.$auth;

      const consumer = {
        key: devKey,
        secret: devSecret,
      };

      const oauth = new OAuth({
        consumer,
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
          return crypto
            .createHmac("sha1", key)
            .update(base_string)
            .digest("base64");
        },
      });

      const token = {
        key,
        secret,
      };

      const requestData = transformConfigForOauth(config);

      return oauth.toHeader(oauth.authorize(requestData, token));
    },
    _getBaseUrl() {
      return "https://api.twitter.com/2";
    },
    async _httpRequest({
      $ = this, headers, specialAuth = false, throwError = true, fallbackError, ...args
    }: HttpRequestParams): Promise<ResponseObject<TwitterEntity>> {
      const maxRetries = 3;
      let response: ResponseObject<TwitterEntity>;
      let counter = 1;

      const config = {
        baseURL: this._getBaseUrl(),
        ...args,
      };

      const authConfig = specialAuth
        ? {
          ...config,
          params: {},
          data: {},
        }
        : config;

      const axiosConfig = {
        debug: true,
        ...config,
        headers: {
          ...headers,
          ...this._getAuthHeader(authConfig),
        },
      };

      do {
        try {
          response = await axios($, axiosConfig);

        } catch (err) {
          console.log(`Request error on attempt #${counter}: `, err);
          if (counter === maxRetries) {
            if (throwError && err.response?.data) {
              this.throwError(err.response.data);
            }
            if (fallbackError) {
              throw new ConfigurationError(fallbackError);
            }
            throw err;
          }
        }
      } while (!response && ++counter <= maxRetries);

      return response;
    },
    async _paginatedRequest({
      maxResults = 100,
      maxPerPage = 100,
      params,
      ...args
    }: PaginatedRequestParams): Promise<
      PaginatedResponseObject<TwitterEntity>
    > {
      const totalData = [],
        totalErrors = [],
        totalIncludes = {};
      let paginationToken: string;
      let resultCount = 0;

      do {
        const perPage = Math.min(maxResults - resultCount, maxPerPage);

        const {
          data,
          errors,
          meta: { next_token },
          includes,
        }: PaginatedResponseObject<TwitterEntity> = await this._httpRequest({
          params: {
            ...params,
            max_results: perPage,
            pagination_token: paginationToken,
          },
          ...args,
        });

        if (data) {
          totalData.push(...(Array.isArray(data)
            ? data
            : [
              data,
            ]));
        }

        if (errors) {
          totalErrors.push(...(Array.isArray(errors)
            ? errors
            : [
              errors,
            ]));
        }

        if (includes) {
          Object.entries(includes).forEach(
            ([
              key,
              value]: [string, TwitterEntity[]
              ]) => {
              if (!totalIncludes[key]) totalIncludes[key] = [];
              totalIncludes[key].push(...value);
            },
          );
        }

        paginationToken = next_token;
        resultCount += perPage;
      } while (paginationToken && resultCount < maxResults);

      return {
        data: totalData,
        errors: totalErrors,
        includes: totalIncludes,
      };
    },
    async addUserToList({
      listId,
      ...args
    }: AddUserToListParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        url: `/lists/${listId}/members`,
        ...args,
      });
    },
    async createTweet(args: CreateTweetParams): Promise<object> {
      return this._httpRequest({
        throwError: false,
        method: "POST",
        url: "/tweets",
        ...args,
      });
    },
    async deleteTweet({
      tweetId,
      ...args
    }: DeleteTweetParams): Promise<object> {
      return this._httpRequest({
        method: "DELETE",
        url: `/tweets/${tweetId}`,
        ...args,
      });
    },
    async followUser(args: FollowUserParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      return this._httpRequest({
        method: "POST",
        url: `/users/${id}/following`,
        ...args,
      });
    },
    async getListTweets({
      listId,
      ...args
    }: GetListTweetsParams): Promise<PaginatedResponseObject<Tweet>> {
      return this._paginatedRequest({
        url: `/lists/${listId}/tweets`,
        ...args,
      });
    },
    async getTweet({
      tweetId,
      ...args
    }: GetTweetParams): Promise<ResponseObject<Tweet>> {
      return this._httpRequest({
        url: `/tweets/${tweetId}`,
        ...args,
      });
    },
    async getAuthenticatedUser(
      args: GetAuthenticatedUserParams,
    ): Promise<ResponseObject<User>> {
      return this._httpRequest({
        url: "/users/me",
        ...args,
      });
    },
    async getAuthenticatedUserId(): Promise<User["id"]> {
      const response = await this.getAuthenticatedUser();
      return response.data.id;
    },
    async getDirectMessages(
      args: GetDirectMessagesParams,
    ): Promise<PaginatedResponseObject<DirectMessage>> {
      return this._paginatedRequest({
        url: "/dm_events",
        ...args,
      });
    },
    async getUserLikedTweets({
      userId,
      ...args
    }: GetUserLikedTweetParams): Promise<PaginatedResponseObject<Tweet>> {
      return this._paginatedRequest({
        url: `/users/${userId}/liked_tweets`,
        ...args,
      });
    },
    async getUserOwnedLists({
      userId,
      ...args
    }: GetUserOwnedListsParams): Promise<PaginatedResponseObject<List>> {
      return this._httpRequest({
        url: `/users/${userId}/owned_lists`,
        ...args,
      });
    },
    async getUserFollowedLists({
      userId,
      ...args
    }: GetUserFollowedListsParams): Promise<PaginatedResponseObject<List>> {
      return this._paginatedRequest({
        url: `/users/${userId}/followed_lists`,
        ...args,
      });
    },
    async getUserMentions({
      userId,
      ...args
    }: GetUserMentionsParams): Promise<PaginatedResponseObject<Tweet>> {
      return this._paginatedRequest({
        url: `/users/${userId}/mentions`,
        ...args,
      });
    },
    async getUserTweets({
      userId,
      ...args
    }: GetUserTweetsParams): Promise<PaginatedResponseObject<Tweet>> {
      return this._paginatedRequest({
        url: `/users/${userId}/tweets`,
        ...args,
      });
    },
    async getUserByUsername(username: string): Promise<ResponseObject<User>> {
      return this._httpRequest({
        url: `/users/by/username/${username}`,
      });
    },
    async getUser({
      userId,
      ...args
    }: GetUserParams): Promise<ResponseObject<User>> {
      return this._httpRequest({
        url: `/users/${userId}`,
        ...args,
      });
    },
    async likeTweet(args: LikeTweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      return this._httpRequest({
        method: "POST",
        url: `/users/${id}/likes`,
        ...args,
      });
    },
    async getUserFollowers({
      userId,
      ...args
    }: GetUserFollowersParams): Promise<PaginatedResponseObject<User>> {
      return this._paginatedRequest({
        url: `/users/${userId}/followers`,
        ...args,
      });
    },
    async getUserFollowing({
      userId,
      ...args
    }: GetUserFollowingParams): Promise<PaginatedResponseObject<User>> {
      return this._paginatedRequest({
        url: `/users/${userId}/following`,
        ...args,
      });
    },
    async retweet(args: RetweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      return this._httpRequest({
        method: "POST",
        url: `/users/${id}/retweets`,
        ...args,
      });
    },
    async searchTweets(
      args: SearchTweetsParams,
    ): Promise<PaginatedResponseObject<Tweet>> {
      return this._paginatedRequest({
        url: "/tweets/search/recent",
        ...args,
      });
    },
    async sendMessage({
      userId,
      ...args
    }: SendMessageParams): Promise<object> {
      return this._httpRequest({
        method: "POST",
        url: `/dm_conversations/with/${userId}/messages`,
        ...args,
      });
    },
    async unfollowUser({
      userId,
      ...args
    }: UnfollowUserParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      return this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/following/${userId}`,
        ...args,
      });
    },
    async unlikeTweet({
      tweetId,
      ...args
    }: UnlikeTweetParams): Promise<object> {
      const id = await this.getAuthenticatedUserId();
      return this._httpRequest({
        method: "DELETE",
        url: `/users/${id}/likes/${tweetId}`,
        ...args,
      });
    },
    async uploadMedia(args: UploadMediaParams): Promise<object> {
      return this._httpRequest({
        baseURL: "https://upload.twitter.com/1.1",
        url: "/media/upload.json",
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${args.data.getBoundary()}`,
        },
        specialAuth: true,
        ...args,
      });
    },
  },
});
