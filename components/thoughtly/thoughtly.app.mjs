import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thoughtly",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "The type of the event.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to receive the webhook.",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
    },
    interviewId: {
      type: "string",
      label: "Interview ID",
      description: "The ID of the interview.",
    },
    idMetadata: {
      type: "string",
      label: "ID Metadata",
      description: "The optional ID metadata.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the new contact.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new contact.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the new contact's phone number.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the new contact.",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Additional attributes for the new contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thought.ly";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
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
    async createContact({
      phoneNumber, name, email, countryCode, tags, attributes,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/create",
        data: {
          phoneNumber,
          name,
          email,
          countryCode,
          tags,
          attributes,
        },
      });
    },
    async callContact({
      contactId, interviewId, idMetadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/call",
        data: {
          contactId,
          interviewId,
          idMetadata,
        },
      });
    },
    async subscribeToWebhook({
      type, url,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscribe",
        data: {
          type,
          url,
        },
      });
    },
    async unsubscribeFromWebhook({ idMetadata }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/unsubscribe/${idMetadata}`,
      });
    },
    async getContacts() {
      return this._makeRequest({
        path: "/contact",
      });
    },
    async deleteContact({ contactId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contact/${contactId}`,
      });
    },
    async getInterviews() {
      return this._makeRequest({
        path: "/interview",
      });
    },
    async getInterviewResponses({ interviewId }) {
      return this._makeRequest({
        path: `/interview/${interviewId}/responses`,
      });
    },
  },
};
