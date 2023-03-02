import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddUserToListParams,
  CreateTweetParams,
  FollowUserParams,
  GetLikedTweetParams,
  GetOwnedListsParams,
  GetTweetParams,
  GetUserMentionsParams,
  GetUserParams,
  GetUserTweetsParams,
  HttpRequestParams,
  LikeTweetParams,
  ListFollowersParams,
  RetweetParams,
  UnfollowUserParams,
  UnlikeTweetParams,
} from "../common/requestParams";
import {
  MEDIA_FIELD_OPTIONS, POLL_FIELD_OPTIONS, TWEET_FIELD_OPTIONS, USER_FIELD_OPTIONS,
} from "../common/dataFields";
import {
  TWEET_EXPANSION_OPTIONS, USER_EXPANSION_OPTIONS,
} from "../common/expansions";

export default defineApp({
  type: "app",
  app: "twitter_v2",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Select a **List** or use a custom *List ID*.",
      async options() {
        const userId = this.getAuthenticatedUser();
        const lists = await this.getOwnedLists({
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
      options: MEDIA_FIELD_OPTIONS,
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
    async addUserToList({
      listId, ...args
    }: AddUserToListParams) {
      const response = await this._httpRequest({
        method: "POST",
        url: `/lists/${listId}/members`,
        ...args,
      });
      return response.data;
    },
    async createTweet(args: CreateTweetParams) {
      const response = await this._httpRequest({
        method: "POST",
        url: "/tweets",
        ...args,
      });
      return response.data;
    },
    async deleteTweet(tweetId: string) {
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/tweets/${tweetId}`,
      });
      return response.data;
    },
    async followUser(args: FollowUserParams) {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/following`,
        ...args,
      });
      return response.data;
    },
    async getTweet({
      tweetId, ...args
    }: GetTweetParams) {
      const response = await this._httpRequest({
        url: `/tweets/${tweetId}`,
        ...args,
      });
      return response.data;
    },
    async getAuthenticatedUserId() {
      const response = await this._httpRequest({
        url: "/users/me",
      });
      return response.data.id;
    },
    async getLikedTweets({
      userId, ...args
    }: GetLikedTweetParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/liked_tweets`,
        ...args,
      });
      return response.data;
    },
    async getOwnedLists({
      userId, ...args
    }: GetOwnedListsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/owned_lists`,
        ...args,
      });
      return response.data;
    },
    async getUserMentions({
      userId, ...args
    }: GetUserMentionsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/mentions`,
        ...args,
      });
      return response.data;
    },
    async getUserTweets({
      userId, ...args
    }: GetUserTweetsParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/tweets`,
        ...args,
      });
      return response.data;
    },
    async getUserByUsername(username: string) {
      const response = await this._httpRequest({
        url: `/users/by/username/${username}`,
      });
      return response.data;
    },
    async getUser({
      userId, ...args
    }: GetUserParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}`,
        ...args,
      });
      return response.data;
    },
    async likeTweet(args: LikeTweetParams) {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/likes`,
        ...args,
      });
      return response.data;
    },
    async listFollowers({
      userId, ...args
    }: ListFollowersParams) {
      const response = await this._httpRequest({
        url: `/users/${userId}/followers`,
        ...args,
      });
      return response.data;
    },
    async retweet(args: RetweetParams) {
      const id = await this.getAuthenticatedUserId();
      const response = await this._httpRequest({
        method: "POST",
        url: `/users/${id}/retweets`,
        ...args,
      });
      return response.data;
    },
    async unfollowUser({
      userId, ...args
    }: UnfollowUserParams) {
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
    }: UnlikeTweetParams) {
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
