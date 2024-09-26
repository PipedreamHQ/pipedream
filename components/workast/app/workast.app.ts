import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "workast",
  propDefinitions: {
    userId: {
      label: "User ID",
      description: "The user ID",
      type: "string",
      async options() {
        const users = await this.getUsers();

        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    listId: {
      label: "List/Space ID",
      description: "The list/space ID",
      type: "string",
      async options() {
        const lists = await this.getLists();

        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.todobot.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiToken()}`,
        },
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    async getLists(args = {}) {
      return this._makeRequest({
        path: "/list",
        ...args,
      });
    },
    async getTasks({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/list/${listId}/task`,
        ...args,
      });
    },
    async createTask({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/list/${listId}/task`,
        method: "post",
        ...args,
      });
    },
    async createSpace({ ...args }) {
      return this._makeRequest({
        path: "/list",
        method: "post",
        ...args,
      });
    },
  },
});
