import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  AddUserToListParams, HttpRequestParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "twitter",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Select a **List** or use a custom *List ID*.",
      async options() {
        const { id } = this.getAuthenticatedUser();
        const lists = await this.getOwnedLists(id);
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
        "The Twitter username (handle) of the user, prefixed with `@` (e.g. `@pipedream`). You can also reference a User ID from a previous step.",
    },
    tweetId: {
      type: "string",
      label: "Tweet ID",
      description: "The numerical ID of the tweet (also known as \"status\")",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitter.com/2";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
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
      return response?.data?.is_member ?? response;
    },
    async deleteTweet(
      tweetId: string) {
      const response = await this._httpRequest({
        method: "DELETE",
        url: `/tweets/${tweetId}`,
      });
      return response?.data?.deleted ?? response;
    },
    async getAuthenticatedUser() {
      const response = await this._httpRequest({
        url: "/users/me",
      });
      return response.data;
    },
    async getUserByUsername(username: string) {
      const response = await this._httpRequest({
        url: `/users/by/username/${username}`,
      });
      return response.data;
    },
    async getOwnedLists(userId: string) {
      const response = await this._httpRequest({
        url: `/users/${userId}/owned_lists`,
      });
      return response.data;
    },
  },
});
