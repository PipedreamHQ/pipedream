import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ringover",
  propDefinitions: {
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact",
    },
    contactPhone: {
      type: "string",
      label: "Contact Phone",
      description: "The phone number of the contact",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
      optional: true,
    },
    smsTo: {
      type: "string",
      label: "SMS To",
      description: "The phone number to send the SMS to",
    },
    smsText: {
      type: "string",
      label: "SMS Text",
      description: "The text of the SMS",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.server}.ringover.com/v2`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `${this.$auth.api_key}`,
          "Accept": "application/json",
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
    async sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/push/sms",
        data: {
          to: opts.smsTo,
          text: opts.smsText,
        },
      });
    },
  },
};
