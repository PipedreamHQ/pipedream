import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peach",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact to send the message to",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.trypeach.io/api/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    sendTransactionalMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transactional_messages",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
  },
};
