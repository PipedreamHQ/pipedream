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
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead.",
      optional: true,
    },
    picture: {
      type: "string",
      label: "Picture",
      description: "Picture of the lead.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone of the lead.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "Linkedin URL",
      description: "Linkedin URL of the lead.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name of the lead.",
      optional: true,
    },
    icebreaker: {
      type: "string",
      label: "Icebreacker",
      description: "Icebreaker of the lead.",
      optional: true,
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
    async getLead({
      $, email,
    }) {
      return this._makeRequest({
        $,
        path: `leads/${email}`,
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
    async pauseResumeLeadFromAllCampaigns({
      $, email, action,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `leads/${action}/${email}`,
      });
    },
    async removeLeadFromACampaign({
      $, email, campaignId, params,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `campaigns/${campaignId}/leads/${email}`,
        params,
      });
    },
    async addEmailToUnsubscribes({
      $, email,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `unsubscribes/${email}`,
      });
    },
    async deleteEmailFromUnsubscribes({
      $, email,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `unsubscribes/${email}`,
      });
    },
    async updateLeadInACampaign({
      $, email, campaignId, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `campaigns/${campaignId}/leads/${email}`,
        data,
      });
    },
    async getActivities({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "activities",
        params,
      });
    },
    async createWebhook({ data }) {
      return this._makeRequest({
        method: "POST",
        path: "hooks",
        data,
      });
    },
    async removeWebhook({ hookId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `hooks/${hookId}`,
      });
    },
  },
};
