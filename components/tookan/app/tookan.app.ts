import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/requestParams";

export default defineApp({
  type: "app",
  app: "tookan",
  propDefinitions: {},
  methods: {
    _baseUrl(): string {
      return "https://api.tookanapp.com/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      data,
      method,
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          api_key: this.$auth.api_key,
          ...data,
        },
        method,
      });
    },
  },
});
