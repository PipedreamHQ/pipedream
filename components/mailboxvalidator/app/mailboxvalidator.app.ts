import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  VerifyEmailParams,
  VerifyEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "mailboxvalidator",
  methods: {
    _baseUrl(): string {
      return "https://api.mailboxvalidator.com/v1";
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
          format: 'json',
        },
      });
    },
    async validateEmail(
      args: VerifyEmailParams
    ): Promise<VerifyEmailResponse> {
      return this._httpRequest({
        endpoint: "/validation/single",
        ...args,
      });
    },
  },
});
