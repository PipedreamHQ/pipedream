import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams, VerifyEmailParams, VerifyEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "neverbounce",
  methods: {
    _baseUrl(): string {
      return "https://api.neverbounce.com/v4";
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
          key: this.$auth.api_key,
        },
      });
    },
    async verifyEmailAddress(args: VerifyEmailParams): Promise<VerifyEmailResponse> {
      const response: VerifyEmailResponse = await this._httpRequest({
        endpoint: "/single/check",
        ...args,
      });

      const { status } = response;
      if (status !== "success") throw new Error(`NeverBounce response status: ${status}`);

      return response;
    },
  },
});
