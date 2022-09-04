import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "quickemailverification",
  propDefinitions: {},
  methods: {
    _baseUrl(): string {
      return "https://api.quickemailverification.com/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      params,
      ...args
    }): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        params: {
          ...params,
          apikey: this.$auth.api_key
        },
        ...args,
      });
    },
  },
});