import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { VerifyEmailParams } from "../common/requestParams";

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
      params
    }): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        params: {
          ...params,
          apikey: this.$auth.api_key
        },
      });
    },
    async verifyEmailAddress(args: VerifyEmailParams): Promise<any> {
      return this._httpRequest({
        endpoint: "/verify",
        ...args
      })
    }
  },
});