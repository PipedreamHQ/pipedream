import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloudpresenter",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Unique identifier for the contact",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact such as name, email, and more",
    },
    newContactDetails: {
      type: "object",
      label: "New Contact Details",
      description: "The details for the new contact",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.cloudpresenter.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact(newContactDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: newContactDetails,
      });
    },
    async updateContact(contactId, contactDetails) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data: contactDetails,
      });
    },
    async emitEvent(eventName, metadata) {
      this.$emit(metadata, {
        summary: eventName,
        id: metadata.id,
      });
    },
  },
};
