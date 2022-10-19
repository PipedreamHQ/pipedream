import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  VerifyEmailParams, VerifyEmailResponse,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "mattermost",
  methods: {
    _baseUrl(domain: string): string {
      return `https://${domain}/api/v4`;
    },
    _getAuth(): object {
      return {
        domain: this.$auth.domain,
        token: this.$auth.oauth_access_token,
      }
    }
    async _httpRequest({
      $ = this,
      endpoint,
      params,
    }: HttpRequestParams): Promise<object> {
      const { domain, token } = this._getAuth();
      return axios($, {
        url: this._baseUrl(domain) + endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      return response;
    },
  },
});
