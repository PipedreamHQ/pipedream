import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nexweave",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign for which you want to create an experience.",
      async options({ prevContext }) {
        const {
          campaigns, nextPage,
        } = await this.listCampaigns(prevContext);
        return {
          options: campaigns.map((campaign) => ({
            label: campaign.name,
            value: campaign.id,
          })),
          context: {
            nextPage,
          },
        };
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template for which you want to create an experience.",
      async options({ prevContext }) {
        const {
          templates, nextPage,
        } = await this.listTemplates(prevContext);
        return {
          options: templates.map((template) => ({
            label: template.name,
            value: template.id,
          })),
          context: {
            nextPage,
          },
        };
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
    async listCampaigns(prevContext = {}) {
      const nextPage = prevContext.nextPage || 1;
      const response = await this._makeRequest({
        path: "/campaigns",
        params: {
          page: nextPage,
        },
      });
      return {
        campaigns: response.campaigns,
        nextPage: response.nextPage,
      };
    },
    async listTemplates(prevContext = {}, type = "image") {
      const nextPage = prevContext.nextPage || 1;
      const response = await this._makeRequest({
        path: "/templates",
        params: {
          page: nextPage,
          type,
        },
      });
      return {
        templates: response.templates,
        nextPage: response.nextPage,
      };
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
