import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_cliq",
  propDefinitions: {
    channel: {
      label: "Channel ID",
      description: "The identifier of a channel",
      type: "string",
      async options({
        prevContext, useName,
      }) {
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
            value: useName
              ? channel.unique_name
              : channel.chat_id,
          })),
          context: {
            has_more,
            next_token,
          },
        };
      },
    },
    chat: {
      label: "Chat ID",
      description: "The identifier of a chat",
      type: "string",
      async options() {
        const { chats } = await this.getChats();

        return chats?.map(({
          chat_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
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
    _makeRequest({
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
    getChannels(args = {}) {
      return this._makeRequest({
        path: "/channels",
        ...args,
      });
    },
    getChats(args = {}) {
      return this._makeRequest({
        path: "/chats",
        ...args,
      });
    },
    getMessages({
      chatId, ...args
    }) {
      return this._makeRequest({
        path: `/chats/${chatId}/messages`,
        ...args,
      });
    },
    sendDirectMessage({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/buddies/${email}/message`,
        method: "post",
        ...args,
      });
    },
    sendChannelMessage({
      channelName, ...args
    }) {
      return this._makeRequest({
        path: `/channelsbyname/${channelName}/message`,
        method: "post",
        ...args,
      });
    },
    sendBotMessage({
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
