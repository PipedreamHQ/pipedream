import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flexmail",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      required: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      required: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      required: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      required: true,
    },
    additionalInfo: {
      type: "object",
      label: "Additional Info",
      description: "Additional contact information",
      optional: true,
    },
    interestName: {
      type: "string",
      label: "Interest Name",
      description: "The name of the interest",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flexmail.eu/v1";
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
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async updateContact(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${opts.contactId}`,
        ...opts,
      });
    },
    async unsubscribeContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${opts.contactId}/unsubscribe`,
        ...opts,
      });
    },
    async manageSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${opts.contactId}/interests`,
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
