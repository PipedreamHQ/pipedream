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
        return this.getItemOptions(campaigns);
      },
      reloadProps: true,
    },
    imageTemplateId: {
      type: "string",
      label: "Image Template ID",
      description: "Select the image template for which you want to create an experience.",
      async options() {
        const templates = await this.listTemplates("image");
        return this.getItemOptions(templates);
      },
      reloadProps: true,
    },
    videoTemplateId: {
      type: "string",
      label: "Video Template ID",
      description: "Select the video template for which you want to create an experience.",
      async options() {
        const templates = await this.listTemplates("video");
        return this.getItemOptions(templates);
      },
      reloadProps: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nexweave.com/api/v1";
    },
    getItemOptions(items) {
      return items?.map?.(({
        id, name,
      }) => ({
        label: name,
        value: id,
      }));
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
    async listTemplates(type) {
      return this._makeRequest({
        path: "/integration/template",
        params: {
          template_type: type,
        },
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
