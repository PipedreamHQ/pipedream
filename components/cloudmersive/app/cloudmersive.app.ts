import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "yelp",
  methods: {
    _apiKey(): string {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.cloudmersive.com";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Apikey: this._apiKey(),
        },
        ...args,
      });
    },
  },
});
