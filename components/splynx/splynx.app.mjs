import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splynx",
  version: "0.0.1",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
    },
    personalInformation: {
      type: "object",
      label: "Personal Information",
      description: "Personal information of the customer, including unique identification details",
      optional: false,
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Contact details of the customer",
      optional: false,
    },
    serviceDetails: {
      type: "object",
      label: "Service Details",
      description: "Details of the internet service including speed, plan period, and pricing",
      optional: false,
    },
    specialConditions: {
      type: "string[]",
      label: "Special Conditions",
      description: "Any special conditions or offers attached to the service",
      optional: true,
    },
    updatedFields: {
      type: "object",
      label: "Updated Fields",
      description: "Fields to update for an existing customer",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.splynx.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Splynx-EA (access_token=${this.$auth.oauth_access_token})`,
        },
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers",
        ...args,
      });
    },
    async createInternetService({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/customers/${customerId}/services/internet`,
        ...args,
      });
    },
    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/customers/${customerId}`,
        ...args,
      });
    },
  },
};
