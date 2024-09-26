import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "commpeak",
  propDefinitions: {
    requestType: {
      type: "string",
      label: "Request Type",
      description: "The lookup type.",
      options: [
        {
          label: "Validation only (validate)",
          value: "validate",
        },
        {
          label: "Full lookup (hlr)",
          value: "hlr",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://hlr.commpeak.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getAccountInfo(args) {
      return this._makeRequest({
        url: "/info",
        ...args,
      });
    },
    async getSingleNumberLookup({
      requestType, phoneNumber, ...args
    }) {
      return this._makeRequest({
        url: `/sync/${requestType}/${phoneNumber}`,
        ...args,
      });
    },
    async requestBulkNumberLookup({
      requestType, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/async/${requestType}`,
        ...args,
      });
    },
    async getBulkLookupResults({
      taskId, ...args
    }) {
      return this._makeRequest({
        url: `/result/${taskId}`,
        ...args,
      });
    },
  },
};
