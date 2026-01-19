import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pitchlane",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns?.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.pitchlane.com/api/public/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    getCampaignSchemas({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/schemas`,
        ...opts,
      });
    },
    createCampaignVideo({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/videos`,
        ...opts,
      });
    },
  },
};
