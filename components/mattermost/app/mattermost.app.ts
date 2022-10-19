import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  PostMessageParams, PostMessageResponse,
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
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      const { domain, token } = this._getAuth();
      return axios($, {
        url: this._baseUrl(domain) + endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...args
      });
    },
    async postMessage(args: PostMessageParams): Promise<PostMessageResponse> {
      const response: PostMessageResponse = await this._httpRequest({
        endpoint: "/posts",
        method: "POST",
        ...args,
      });

      return response;
    },
  },
});
