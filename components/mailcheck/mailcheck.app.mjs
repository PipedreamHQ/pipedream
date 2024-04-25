import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailcheck",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to verify.",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "The email addresses to verify.",
    },
    operationName: {
      type: "string",
      label: "Operation Name",
      description: "The name returned on a batch operation creation. E.g. **operation/7093f46f-54c5-44b4-96ec-f891ca076082**",
      async options() {
        const { operations } = await this.listBatches();

        return operations.map(({ name }) => name);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mailcheck.co/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listBatches(opts = {}) {
      return this._makeRequest({
        path: "/emails/operations",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/singleEmail:check",
        ...opts,
      });
    },
    createBatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/emails:check",
        ...opts,
      });
    },
    getBatchOperationStatus({
      operationName, ...opts
    }) {
      return this._makeRequest({
        path: `/emails/${operationName}`,
        ...opts,
      });
    },
  },
};
