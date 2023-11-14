import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nexweave",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign for which you want to create an experience.",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
      reloadProps: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template for which you want to create an experience.",
      async options() {
        const templates = await this.listTemplates();
        return templates.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
      reloadProps: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nexweave.com/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...otherOpts,
        headers: {
          "X-API-KEY": this.$auth.api_key,
          ...headers,
        },
      });
    },
    async listCampaigns() {
      return this._makeRequest({
        path: "/integration/campaign",
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/integration/template",
      });
    },
    async getCampaignDetails(campaignId) {
      return this._makeRequest({
        path: `/integration/campaign/${campaignId}`,
      });
    },
    async getTemplateDetails(templateId) {
      return this._makeRequest({
        path: `/integration/template/${templateId}`,
      });
    },
    async createExperience(args) {
      return this._makeRequest({
        method: "POST",
        path: "/nexweave-integration/experience",
        ...args,
      });
    },
  },
};
