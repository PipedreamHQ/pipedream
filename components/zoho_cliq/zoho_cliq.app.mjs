import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_cliq",
  propDefinitions: {
    channelName: {
      label: "Channel Name",
      description: "The channel name",
      type: "string",
      async options({ prevContext }) {
        const params = {
          joined: true,
        };

        if (prevContext.has_more) {
          params[next_token] = prevContext.next_token;
        }

        const {
          channels, has_more, next_token,
        } = await this.getChannels({
          params,
        });

        return {
          options: channels.map((channel) => ({
            label: channel.name,
            value: channel.unique_name,
          })),
          context: {
            has_more,
            next_token,
          },
        };
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return this.$auth.base_api_uri;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}/api/v2${path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getChannels(args = {}) {
      return this._makeRequest({
        path: "/channels",
        ...args,
      });
    },
    async sendDirectMessage({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/buddies/${email}/message`,
        method: "post",
        ...args,
      });
    },
    async sendChannelMessage({
      channelName, ...args
    }) {
      return this._makeRequest({
        path: `/channelsbyname/${channelName}/message`,
        method: "post",
        ...args,
      });
    },
    async sendBotMessage({
      botName, ...args
    }) {
      return this._makeRequest({
        path: `/bots/${botName}/message`,
        method: "post",
        ...args,
      });
    },
  },
};
