import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "the_magic_drip",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select a campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the lead",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn URL of the lead",
      optional: true,
    },
    desiredState: {
      type: "boolean",
      label: "Desired State",
      description: "Set to true to activate, false to deactivate the campaign",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.themagicdrip.com/v1";
    },
    async _makeRequest({
      $, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaign",
        ...opts,
      });
    },
    async addLeadToCampaign({
      campaignId, company, linkedinUrl,
    }, opts = {}) {
      const leadData = {};
      if (company) leadData.company = company;
      if (linkedinUrl) leadData.linkedinUrl = linkedinUrl;

      return this._makeRequest({
        method: "POST",
        path: `/campaign/leads/${campaignId}`,
        data: {
          leadsWithCustomVariables: [
            leadData,
          ],
        },
        ...opts,
      });
    },
    async markCampaignActiveInactive({
      campaignId, desiredState,
    }, opts = {}) {
      const path = desiredState
        ? `/campaign/${campaignId}/active`
        : `/campaign/${campaignId}/inactive`;
      return this._makeRequest({
        method: "POST",
        path,
        ...opts,
      });
    },
    async listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    async pollNewCampaigns(lastRunAt) {
      const campaigns = await this.listCampaigns();
      return campaigns.filter(
        (campaign) => new Date(campaign.createdAt) > new Date(lastRunAt),
      );
    },
    async pollNewTemplates(lastRunAt) {
      const templates = await this.listTemplates();
      return templates.filter(
        (template) => new Date(template.createdAt) > new Date(lastRunAt),
      );
    },
  },
};
