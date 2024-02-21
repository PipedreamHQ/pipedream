import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "interseller",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
    },
    booked: {
      type: "boolean",
      label: "Booked",
      description: "A true/false value to indicate if the contact also booked a meeting.",
    },
    sentiment: {
      type: "string",
      label: "Sentiment",
      description: "The sentiment of the contact. Can be INTERESTED, NOT_INTERESTED, BAD_FIT, WRONG_CONTACT, or TIMING. Set this field to null to clear the value out.",
      options: [
        {
          label: "Interested",
          value: "INTERESTED",
        },
        {
          label: "Not Interested",
          value: "NOT_INTERESTED",
        },
        {
          label: "Bad Fit",
          value: "BAD_FIT",
        },
        {
          label: "Wrong Contact",
          value: "WRONG_CONTACT",
        },
        {
          label: "Timing",
          value: "TIMING",
        },
        {
          label: "Clear Value",
          value: null,
        },
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "The profile URL of the contact.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The source URL of the contact.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://interseller.io/api";
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
    async listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    async setContactReplied({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}/replied`,
        ...opts,
      });
    },
  },
};
