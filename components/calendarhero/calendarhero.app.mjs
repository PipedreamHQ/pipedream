import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "calendarhero",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    } = {}) {
      return axios($, {
        baseURL: "https://api.calendarhero.com",
        headers: {
          ...headers,
          Authorization: `${this.calendarhero.api_key}`,
        },
        ...args,
      });
    },
  },
};
