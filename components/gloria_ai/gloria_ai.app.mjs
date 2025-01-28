import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gloria_ai",
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
      options: [
        "Inbound",
        "Outbound",
      ],
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
      options: [
        "active",
        "archived",
        "favorite",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.iamgloria.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "tenant-id": `${this.$auth.tenant_id}`,
        },
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
