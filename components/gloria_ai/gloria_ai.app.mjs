import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gloria_ai",
  version: "0.0.{{ts}}",
  propDefinitions: {
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the lead",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
      optional: true,
    },
    initiation: {
      type: "string",
      label: "Initiation",
      description: "Initiation details for the lead",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the lead",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the lead",
      optional: true,
    },
  },
  methods: {
    // Existing method from the existing app file
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.iamgloria.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/contacts",
        data: {
          name: this.leadName,
          phone: this.phone,
          email: this.email,
          initiation: this.initiation,
          tags: this.tags,
          status: this.status,
        },
        ...opts,
      });
    },
  },
};
