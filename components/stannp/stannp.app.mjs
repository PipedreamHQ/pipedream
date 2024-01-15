import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stannp",
  version: "0.0.{{ts}}",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Select the group ID",
      async options() {
        const { data } = await this.listGroups();
        return data.map((group) => ({
          label: group.name,
          value: group.id.toString(),
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign ID",
      async options() {
        const { data } = await this.listCampaigns();
        return data.map((campaign) => ({
          label: campaign.name,
          value: campaign.id.toString(),
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template ID",
      async options() {
        const { data } = await this.listTemplates();
        return data.map((template) => ({
          label: template.name,
          value: template.id.toString(),
        }));
      },
    },
    campaignName: {
      type: "string",
      label: "Campaign Name",
      description: "Name your campaign for reference.",
    },
    campaignType: {
      type: "string",
      label: "Campaign Type",
      description: "The type of campaign this will be.",
      options: [
        "4x6-postcard",
        "6x9-postcard",
        "us-letter",
      ],
    },
    whatRecipients: {
      type: "string",
      label: "What Recipients",
      description: "What recipients do you want this campaign to go to?",
      options: [
        "all",
        "valid",
        "not_valid",
        "int",
      ],
    },
    addons: {
      type: "string",
      label: "Addons",
      description: "If you have an addon code.",
      optional: true,
    },
    admail: {
      type: "boolean",
      label: "Admail",
      description: "Set to true to benefit from admail discounts. Must comply with advertising mail restrictions.",
      optional: true,
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "Comma-separated recipient IDs",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://us.stannp.com/api/v1";
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
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}?api_key=${this.$auth.api_key}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    },
    async listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups/list",
        ...opts,
      });
    },
    async listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns/list",
        ...opts,
      });
    },
    async listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates/list",
        ...opts,
      });
    },
    async createCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/campaigns/create",
        data: {
          name: opts.campaignName,
          type: opts.campaignType,
          template_id: opts.templateId,
          group_id: opts.groupId,
          what_recipients: opts.whatRecipients,
          addons: opts.addons,
          admail: opts.admail,
        },
      });
    },
    async getCampaign(opts = {}) {
      return this._makeRequest({
        path: `/campaigns/get/${opts.campaignId}`,
      });
    },
    async createRecipient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/groups/add/${opts.groupId}`,
        data: {
          recipients: opts.recipientId,
        },
      });
    },
  },
};
