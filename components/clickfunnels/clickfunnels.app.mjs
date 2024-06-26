import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clickfunnels",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Optional details of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://myworkspace.myclickfunnels.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async applyTagToContact({
      contactId, tagId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/applied_tags`,
        data: {
          tag_id: tagId,
        },
      });
    },
    async removeTagFromContact({
      contactId, tagId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}/applied_tags/${tagId}`,
      });
    },
    async searchOrCreateContact({
      email, contactDetails = {},
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workspaces/${this.$auth.workspace_id}/contacts/upsert`,
        data: {
          contact: {
            email_address: email,
            ...contactDetails,
          },
        },
      });
    },
    async emitEvent(eventType, data) {
      this.$emit(data, {
        summary: eventType,
        id: eventType,
      });
    },
    async handleContactIdentified(data) {
      await this.emitEvent("contact.identified", data);
    },
    async handleOneTimeOrderPaid(data) {
      await this.emitEvent("one-time-order.invoice.paid", data);
    },
    async handleSubscriptionInvoicePaid(data) {
      await this.emitEvent("subscription/invoice.paid", data);
    },
  },
};
