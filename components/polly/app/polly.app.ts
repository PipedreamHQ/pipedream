import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "polly",
  propDefinitions: {},
  methods: {
    _baseUrl(): string {
      return "https://api.polly.ai/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
          "X-API-TOKEN": this.$auth.api_key
        },
        ...args,
      });
    },
  },
});