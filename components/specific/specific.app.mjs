import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "specific",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to identify the conversation's owner",
    },
    title: {
      type: "string",
      label: "Title",
      description: "An optional title for the conversation",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to be modified or created",
    },
    contactInfo: {
      type: "object",
      label: "Contact Info",
      description: "The updated details of the contact",
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company to retrieve details for",
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.specific.app";
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
    async emitNewContactCreated() {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {}, // No props required
      });
    },
    async emitNewConversationInitiated() {
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        data: {}, // No props required
      });
    },
    async initializeChatThread({
      userId, title,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        data: {
          userId,
          title,
        },
      });
    },
    async modifyOrCreateContact({
      contactId, contactInfo,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data: contactInfo,
      });
    },
    async retrieveCompanyDetails({ companyId }) {
      return this._makeRequest({
        method: "GET",
        path: `/companies/${companyId}`,
      });
    },
  },
};
