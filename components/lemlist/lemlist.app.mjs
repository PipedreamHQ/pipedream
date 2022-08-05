import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lemlist",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "The ID of the campaign.",
      async options({ page }) {
        const results = await this.listCampaigns({
          params: {
            offset: page * 100,
          },
        });

        return results.map(({
          name, _id,
        }) => ({
          label: name,
          value: _id,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.lemlist.com/api";
    },
    _getAuth() {
      return {
        "password": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        ...otherConfig,
        auth: this._getAuth(),
      };

      return axios($ || this, config);
    },
    async listCampaigns({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "campaigns",
        params,
      });
    },
    async listLeads({
      $, campaignId = null,
    }) {
      const csv = await this._makeRequest({
        $,
        path: `campaigns/${campaignId}/export/leads?state=all`,
      });
      const leads = csv.split(/\r?\n/).map((line) => {
        return line.split(/\r?,/)[0];
      });

      leads.shift();
      return leads;

    },
    async markLeadInAllCampaigns({
      $, email, action,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `leads/${action}/${email}`,
      });
    },
    async markLeadInOneCampaign({
      $, email, campaignId, action,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `campaigns/${campaignId}/leads/${email}/${action}`,
      });
    },
    async addLeadToCampaign({
      $, email, campaignId,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `campaigns/${campaignId}/leads/${email}`,
      });
    },
  },
};
