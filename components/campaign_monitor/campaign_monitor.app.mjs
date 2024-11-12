import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "campaign_monitor",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
    },
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of the subscriber",
      optional: true,
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the email",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.createsend.com/api/v3.3";
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
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitCampaignEmailBounce(campaignId) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/bounces`,
      });
    },
    async emitCampaignEmailOpen(campaignId, subscriberId) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}/opens`,
        params: {
          subscriber_id: subscriberId,
        },
      });
    },
    async emitNewSubscriber(listId) {
      return this._makeRequest({
        path: `/lists/${listId}/active`,
      });
    },
    async sendIntelligentEmail(email, subject, content, listId) {
      return this._makeRequest({
        method: "POST",
        path: "/transactional/send",
        data: {
          email,
          subject,
          content,
          list_id: listId,
        },
      });
    },
    async removeSubscriber(email, listId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscribers/${listId}`,
        params: {
          email,
        },
      });
    },
    async createSubscriber(email, listId, name) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribers/${listId}`,
        data: {
          email,
          list_id: listId,
          name,
        },
      });
    },
  },
};
