import OAuth from "oauth-1.0a";
import crypto from "crypto";
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
  GetAuthenticatedUserParams,
} from "../common/types/requestParams";
import {
  List,
  PaginatedResponseObject,
  ResponseObject,
  Tweet,
  TwitterEntity,
  User,
} from "../common/types/responseSchemas";

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
    async _getAuthHeader(config: HttpRequestParams) {
      const {
        oauth_access_token: key, oauth_refresh_token: secret,
      } =
        this.$auth;

      const consumer = {
        key,
        secret,
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

      if (!config.method) config.method = "GET";

      return oauth.toHeader(oauth.authorize(config, consumer));
    },
    _getBaseUrl() {
      return "https://api.twitter.com/2";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<ResponseObject<TwitterEntity>> {
      const config = {
        baseURL: this._getBaseUrl(),
        ...args,
      };
      // const headers = this._getAuthHeader(config);

      const request = () => axios($, {
        ...config,
        // headers,
      }, {
        oauthSignerUri: this.$auth.oauth_signer_uri,
        token: {
          key: this.$auth.oauth_access_token,
          secret: this.$auth.oauth_refresh_token,
        },
      });

      let response: ResponseObject<TwitterEntity>,
        counter = 1;
      do {
        try {
          response = await request();
        } catch (err) {
          console.log(`Request error on attempt #${counter}: `, err);
        }
      } while (!response && ++counter < 3);
      if (!response) response = await request();
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
    async getAuthenticatedUser(args: GetAuthenticatedUserParams): Promise<ResponseObject<User>> {
      return this._httpRequest({
        url: "/users/me",
        ...args,
      });
    },
    async getAuthenticatedUserId(): Promise<User["id"]> {
      const response = await this.getAuthenticatedUser();
      return response.data.id;
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
  },
});
