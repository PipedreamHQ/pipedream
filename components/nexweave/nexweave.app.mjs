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
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The variables that you want to modify in the campaign or template.",
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
        headers: {
          "X-API-KEY": this.$auth.api_key,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async listCampaigns() {
      return this._makeRequest({
        path: "/campaigns",
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async getCampaignDetails(campaignId) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}`,
      });
    },
    async getTemplateDetails(templateId) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
      });
    },
    async createCampaignExperience(campaignId, variables) {
      return this._makeRequest({
        method: "POST",
        path: "/experiences",
        data: {
          campaign_id: campaignId,
          variables,
        },
      });
    },
    async createTemplateExperience(templateId, variables, type) {
      return this._makeRequest({
        method: "POST",
        path: "/experiences",
        data: {
          template_id: templateId,
          type,
          variables,
        },
      });
    },
  },
};
