import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  VerifyEmailParams, VerifyEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "quickemailverification",
  methods: {
    _baseUrl(): string {
      return "https://api.quickemailverification.com/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      params,
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        params: {
          ...params,
          apikey: this.$auth.api_key,
        },
      });
    },
    async verifyEmailAddress(args: VerifyEmailParams): Promise<VerifyEmailResponse> {
      const response: VerifyEmailResponse = await this._httpRequest({
        endpoint: "/verify",
        ...args,
      });

      if (response.success !== "true") throw new Error(`QuickEmailVerification response: ${response.reason}`);

      return response;
    },
  },
});
