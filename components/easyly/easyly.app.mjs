import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easyly",
  propDefinitions: {
    automationName: {
      type: "string",
      label: "Automation Name",
      description: "The name of the triggered automation",
    },
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "The details of the new lead, such as name, email, and contact number.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the lead",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.easyly.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
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
        data,
        params,
      });
    },
    async postNewLead({
      leadDetails, source,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/post",
        data: {
          ...leadDetails,
          source,
        },
      });
    },
    async triggerZapier({ automationName }) {
      // Placeholder for triggering an event with action 'zapier'
      // The actual implementation depends on the provided API endpoint and mechanism to trigger Zapier automations
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
