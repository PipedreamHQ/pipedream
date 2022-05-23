import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatbot",
  propDefinitions: {},
  methods: {
    _developerAccessToken() {
      return this.$auth.developer_access_token;
    },
    _baseApiUrl() {
      return "https://api.chatbot.com";
    },
    async _makeRequest(path, options = {}, $ = this) {
      const config = {
        ...options,
        url: `${this._baseApiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._developerAccessToken()}`,
        },
      };

      return axios($, config);
    },
    async createWebhook(data) {
      return this._makeRequest("webhooks", {
        method: "post",
        data,
      });
    },
    async deleteWebhook(hookId) {
      return this._makeRequest(`webhooks/${hookId}`, {
        method: "delete",
      });
    },
    async createUser({
      data, $,
    }) {
      return this._makeRequest("users", {
        method: "post",
        data,
      }, $);
    },
    async getUsers({ $ } = {}) {
      let allUsers = [];
      let after = null;

      do {
        const response = await this._makeRequest("users", {
          params: {
            after,
            sort: {
              field: "createdAt",
              order: "desc",
            },
            match: "all",
          },
        }, $);
        const users = response.data;
        if (!users) {
          break;
        }

        allUsers = allUsers.concat(users);

        if (users.length >= 40) {
          after = users[users.length - 1].id;
        } else {
          after = null;
        }
      } while (after);

      return allUsers;
    },
  },
};
