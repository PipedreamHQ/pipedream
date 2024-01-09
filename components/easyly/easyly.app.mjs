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
      description: "Details of the new lead such as name, email, contact number, etc.",
    },
    source: {
      type: "string",
      label: "Lead Source",
      description: "The source where the lead is coming from",
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
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async triggerAutomation({ automationName }) {
      return this._makeRequest({
        method: "POST",
        path: "/automations/trigger",
        data: {
          action: "zapier",
          name: automationName,
        },
      });
    },
    async postNewLead({
      leadDetails, source,
    }) {
      const postData = {
        ...leadDetails,
        ...(source
          ? {
            source,
          }
          : {}),
      };
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        data: postData,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
