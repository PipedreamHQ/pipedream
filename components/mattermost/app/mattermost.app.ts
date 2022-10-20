import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  PostMessageParams, PostMessageResponse,
} from "../common/types";
import { Channel } from "../common/types";

export default defineApp({
  type: "app",
  app: "mattermost",
  propDefinitions: {
    channelId: {
      label: "Channel",
      description: "The channel to post in.",
      type: "string",
      async options() {
        const channels: Channel[] = await this.listChannels();

        return channels.map(({
          id, name, display_name,
        }) => {
          const label = name && display_name && (name !== display_name)
            ? `${display_name} (${name})`
            : (display_name || name);

          return {
            label,
            value: id,
          };
        });
      },
    },
  },
  methods: {
    _baseUrl(domain: string): string {
      return `https://${domain}/api/v4`;
    },
    _getAuth(): object {
      return {
        domain: this.$auth.domain,
        token: this.$auth.oauth_access_token,
      };
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      const {
        domain, token,
      } = this._getAuth();
      return axios($, {
        url: this._baseUrl(domain) + endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...args,
      });
    },
    async postMessage(args: PostMessageParams): Promise<PostMessageResponse> {
      return this._httpRequest({
        endpoint: "/posts",
        method: "POST",
        ...args,
      });
    },
    async listChannels(): Promise<Channel[]> {
      return this._httpRequest({
        endpoint: "/channels",
      });
    },
  },
});
