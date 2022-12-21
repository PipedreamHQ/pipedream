import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams
} from "../common/types";

export default defineApp({
  type: "app",
  app: "practitest",
  methods: {
    _apiKey(): string {
      return this.$auth.api_token
    },
    _baseUrl(): string {
      return "https://api.practitest.com/api/v2";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        auth: {
          username: 'any',
          password: this._apiKey()
        },
        ...args,
      });
    },
  },
});
