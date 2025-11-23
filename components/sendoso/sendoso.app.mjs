import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendoso",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group",
      description: "The ID of the Group.",
      async options() {
        const data = await this.listGroups();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    touchId: {
      type: "integer",
      label: "Touch ID",
      description: "The ID of the Touch.",
      async options() {
        const data = await this.listCampaigns();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackingId: {
      type: "string",
      label: "Tracking Id",
      description: "The tracking code for the send.",
      async options() {
        const data = await this.listSendGifts();

        return data.map(({
          tracking_code: value, touch_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    via: {
      type: "string",
      label: "Via",
      description: "Specify you want to generate gift links.",
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "Specify the name of your Company or Application.",
    },
    sendId: {
      type: "string",
      label: "Send ID",
      description: "The ID of the send.",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign.",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "The ID of the webhook.",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The ID of the report.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for filtering (YYYY-MM-DD format).",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for filtering (YYYY-MM-DD format).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 50,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip.",
      optional: true,
      default: 0,
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.sendoso.com/api/v3";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createEgiftLinks({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "send/generate_egift_links",
        method: "POST",
        data,
      });
    },
    getCurrentUser($ = this) {
      return this._makeRequest({
        $,
        path: "me",
      });
    },
    sendGift({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "send.json",
        method: "POST",
        data,
      });
    },
    getSentGifts(opts = {}) {
      return this._makeRequest({
        path: "sent_gifts.json",
        ...opts,
      });
    },
    getSendStatus({
      trackingId, ...opts
    }) {
      return this._makeRequest({
        path: `gifts/status/${trackingId}`,
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "groups.json",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "users",
        ...opts,
      });
    },
    listGroupMembers({
      groupId, ...opts
    }) {
      return this._makeRequest({
        path: `groups/${groupId}/members`,
        ...opts,
      });
    },
    // Send Management Methods
    listSends({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "send",
        params,
      });
    },
    // Touch Management Methods
    getCampaign({
      $, campaignId,
    }) {
      return this._makeRequest({
        $,
        path: `touches/${campaignId}`,
      });
    },
    // Group Management Methods
    getGroup({
      $, groupId,
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}`,
      });
    },
    addGroupMembers({
      $, groupId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `groups/${groupId}/members`,
        method: "POST",
        data,
      });
    },
    // Campaign Management Methods
    listCampaigns({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "touches",
        params,
      });
    },
    // Catalog Management Methods
    listCatalogItems({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "marketplact/products",
        params,
      });
    },
    // eGift Management Methods
    getEgiftLink({
      $, linkId,
    }) {
      return this._makeRequest({
        $,
        path: `egift_links/${linkId}`,
      });
    },
    // User Management Methods
    getUser({
      $, userId,
    }) {
      return this._makeRequest({
        $,
        path: `users/${userId}`,
      });
    },
  },
};
