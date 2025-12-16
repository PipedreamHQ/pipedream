import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upsales",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      async options() {
        const data = await this.listUsers();
        return data.map((user) => ({
          label: `${user.name} (${user.email})`,
          value: user.clientid,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://integration.upsales.com/api/v2";
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.api_key,
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/master/users",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    async getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async deactivateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/master/users/${userId}`,
        ...args,
      });
    },
  },
};
