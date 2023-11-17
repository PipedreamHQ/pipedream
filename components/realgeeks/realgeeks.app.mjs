import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "realgeeks",
  propDefinitions: {
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead to create",
    },
    leadEmail: {
      type: "string",
      label: "Lead Email",
      description: "The email of the lead to create",
    },
    leadPhone: {
      type: "string",
      label: "Lead Phone",
      description: "The phone number of the lead to create",
      optional: true,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The source of the lead",
      optional: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The status of the lead",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.your_app_name.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        data,
        params,
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
        data,
        params,
      });
    },
    async createLead({
      leadName, leadEmail, leadPhone, leadSource, leadStatus,
    }) {
      return this._makeRequest({
        path: "/leads",
        data: {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          source: leadSource,
          status: leadStatus,
        },
      });
    },
  },
};
