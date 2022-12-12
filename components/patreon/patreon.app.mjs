import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "patreon",
  propDefinitions: {
    campaign: {
      type: "string",
      label: "Campaign",
      description: "Patreon Campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.data.map((campaign) => campaign.id);
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: "https://www.patreon.com/api/oauth2/v2" + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    async createWebhook(data = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        data: {
          data,
        },
      });
    },
    async deleteWebhook({ id }) {
      return this._makeRequest({
        path: `/webhooks/${id}`,
        method: "delete",
      });
    },
  },
};
