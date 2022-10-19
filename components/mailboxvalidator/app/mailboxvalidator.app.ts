import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  ValidateEmailParams,
  ValidateEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "mailboxvalidator",
  methods: {
    _apiKey(): string {
      return this.$auth.api_key;
    },
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
          key: this._apiKey(),
          format: "json",
        },
      });
    },
    async validateEmail(
      args: ValidateEmailParams,
    ): Promise<ValidateEmailResponse> {
      return this._httpRequest({
        endpoint: "/validation/single",
        ...args,
      });
    },
  },
});
