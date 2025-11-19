import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hyros",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email of the lead that will be created. `If no email is entered, a phone number is required`.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead.",
    },
    leadIps: {
      type: "string[]",
      label: "Lead IPs",
      description: "IPs of the lead that will be created. Will be used to the Ad attributing proccess.",
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Phone numbers of the lead that will be created. Will be used on the Ad attributing proccess. `If no email is entered, a phone number is required`.",
    },
    leadStage: {
      type: "string",
      label: "Lead Stage",
      description: "The name of a stage to be applied to the lead",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.hyros.com/v1/api/v1.0";
    },
    _getHeaders() {
      return {
        "API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createCall(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "calls",
        ...args,
      });
    },
    createLead(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "leads",
        ...args,
      });
    },
  },
};
