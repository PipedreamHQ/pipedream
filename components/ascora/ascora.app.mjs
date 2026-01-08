import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ascora",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The unique identifier for a job.",
      optional: true,
    },
    jobDetails: {
      type: "object",
      label: "Job Details",
      description: "The details of the job, either for creating a new job or updating an existing one.",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for a customer.",
      optional: true,
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The details of the customer, either for creating a new customer or updating an existing one.",
    },
    customerIdentifier: {
      type: "string",
      label: "Customer Identifier",
      description: "The identifier for the customer, which could be a name, ID, or other identifying information.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ascora.com.au";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createOrModifyJob({
      jobDetails, jobId = null,
    }) {
      const method = jobId
        ? "PUT"
        : "POST";
      const path = jobId
        ? `/jobs/${jobId}`
        : "/jobs";
      return this._makeRequest({
        method,
        path,
        data: jobDetails,
      });
    },
    async createOrModifyCustomer({
      customerDetails, customerId = null,
    }) {
      const method = customerId
        ? "PUT"
        : "POST";
      const path = customerId
        ? `/customers/${customerId}`
        : "/customers";
      return this._makeRequest({
        method,
        path,
        data: customerDetails,
      });
    },
    async searchCustomer({ customerIdentifier }) {
      return this._makeRequest({
        path: "/customers/search",
        params: {
          identifier: customerIdentifier,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
