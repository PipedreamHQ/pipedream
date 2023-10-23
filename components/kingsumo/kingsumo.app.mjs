import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kingsumo",
  propDefinitions: {
    giveawayId: {
      type: "string",
      label: "Giveaway Id",
      description: "The Id of the Giveaway.",
      async options({ page }) {
        const { data } = await this.listGiveaways({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.kingsumo.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getGiveaway({
      giveawayId, ...args
    }) {
      return this._makeRequest({
        path: `giveaways/${giveawayId}`,
        ...args,
      });
    },
    listContestants({
      giveawayId, ...args
    }) {
      return this._makeRequest({
        path: `giveaways/${giveawayId}/contestants`,
        ...args,
      });
    },
    listGiveaways(args = {}) {
      return this._makeRequest({
        path: "giveaways",
        ...args,
      });
    },
  },
};
