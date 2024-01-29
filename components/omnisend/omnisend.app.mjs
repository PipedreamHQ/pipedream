import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "omnisend",
  version: "0.0.1",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign you'd like to send",
      async options({ page = 0 }) {
        const { campaigns } = await this.listCampaigns({
          offset: page * 100,
          limit: 100,
        });
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.campaignID,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.omnisend.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async listCampaigns({
      offset = 0, limit = 100,
    } = {}) {
      return this._makeRequest({
        path: `/campaigns?offset=${offset}&limit=${limit}`,
      });
    },
    async startCampaign({ campaignId }) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/actions/start`,
      });
    },
    async updateContact({
      contactId, data,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactId}`,
        data,
      });
    },
    async logCustomEvent({
      eventId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}`,
        data,
      });
    },
  },
};
