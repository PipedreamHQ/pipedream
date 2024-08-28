import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gozen_growth",
  propDefinitions: {
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact. Must be a valid email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact. String without special characters.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact. String without special characters.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://apiv1.automation.app.gozen.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createOrUpdateContact({
      emailAddress, firstName, lastName,
    }) {
      const data = {
        contact: {
          email_address: emailAddress,
          first_name: firstName,
          last_name: lastName,
        },
      };
      return this._makeRequest({
        path: "/webhooks/trigger-flow/<workflow-id>",
        data,
      });
    },
  },
};
