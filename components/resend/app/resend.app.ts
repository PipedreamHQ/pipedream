import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "resend",
  propDefinitions: {},
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.$api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: "https://api.resend.com",
        headers: this._getHeaders(),
        ...args,
      });
    },
  },
});
