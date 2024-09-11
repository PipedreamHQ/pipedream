import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "sendbird_ai_chabot",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The identifier of a bot",
      async options({ page }) {
        const { bots } = await this.listBots({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return bots?.map(({ bot }) => ({
          label: bot.bot_nickname,
          value: bot.bot_userid,
        })) || [];
      },
    },
    channelUrl: {
      type: "string",
      label: "Channel URL",
      description: "Specifies the URL of the channel",
      async options({ page }) {
        const { channels } = await this.listGroupChannels({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return channels?.map(({
          name: label, channel_url: value,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api-${this.$auth.application_id}.sendbird.com/v3`;
    },
    _headers() {
      return {
        "Api-Token": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    updateWebhook(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/applications/settings/webhook",
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listGroupChannels(opts = {}) {
      return this._makeRequest({
        path: "/group_channels",
        ...opts,
      });
    },
    sendBotMessage({
      botId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bots/${botId}/send`,
        ...opts,
      });
    },
  },
};
