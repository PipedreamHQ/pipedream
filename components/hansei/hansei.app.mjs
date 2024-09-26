import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hansei",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "Identifier of a bot",
      async options() {
        const bots = await this.listBots();
        return bots?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hansei.app/public/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listCollections(opts = {}) {
      return this._makeRequest({
        path: "/collections",
        ...opts,
      });
    },
    listConversations({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/conversations`,
        ...opts,
      });
    },
  },
};
