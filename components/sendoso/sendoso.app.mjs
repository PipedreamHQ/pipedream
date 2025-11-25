import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendoso",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group",
      description: "The ID of the Group",
      async options() {
        const { groups } = await this.listGroups();

        return groups.map(({
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
      description: "The ID of the Touch",
      async options() {
        const { touches } = await this.listCampaigns();

        return touches.map(({
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
      description: "The tracking code for the send",
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
      description: "Specify you want to generate gift links",
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "Specify the name of your Company or Application",
    },
    sendId: {
      type: "string",
      label: "Send ID",
      description: "The ID of the send",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for filtering (YYYY-MM-DD format)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for filtering (YYYY-MM-DD format)",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return",
      optional: true,
      default: 1,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results to return per page",
      optional: true,
      default: 50,
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
    createEgiftLinks(opts = {}) {
      return this._makeRequest({
        path: "send/generate_egift_links",
        method: "POST",
        ...opts,
      });
    },
    getCurrentUser(opts = {}) {
      return this._makeRequest({
        path: "me",
        ...opts,
      });
    },
    sendGift(opts = {}) {
      return this._makeRequest({
        path: "send",
        method: "POST",
        ...opts,
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
        path: "groups",
        ...opts,
      });
    },
    listSendGifts() {
      return this._makeRequest({
        path: "sent_gifts.json",
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
    listSends(opts = {}) {
      return this._makeRequest({
        path: "send",
        ...opts,
      });
    },
    // Touch Management Methods
    getCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `touches/${campaignId}`,
        ...opts,
      });
    },
    // Campaign Management Methods
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "touches",
        ...opts,
      });
    },
    // Catalog Management Methods (requires auth scope: marketplace)
    listCatalogItems(opts = {}) {
      return this._makeRequest({
        path: "marketplace/products",
        ...opts,
      });
    },
    // eGift Management Methods
    getEgiftLink({
      linkId, ...opts
    }) {
      return this._makeRequest({
        path: `egift_links/${linkId}`,
        ...opts,
      });
    },
    // User Management Methods
    inviteNewUser(opts = {}) {
      return this._makeRequest({
        path: "users",
        method: "POST",
        ...opts,
      });
    },
  },
};
