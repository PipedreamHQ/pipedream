import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "campaign_cleaner",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "The campaign id that will be used.",
      async options() {
        const { campaign_list: data } = await this.listCampaigns();

        return data.map(({
          id: value, campaign_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.campaigncleaner.com/v1";
    },
    _getHeaders() {
      return {
        "X-CC-API-Key": `${this.$auth.api_key}`,
        "accept": "application/json",
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
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "get_campaign_list",
        ...args,
      });
    },
    getCampaignStatus(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "get_campaign_status",
        ...args,
      });
    },
    sendCampaign(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "send_campaign",
        ...args,
      });
    },
  },
};
