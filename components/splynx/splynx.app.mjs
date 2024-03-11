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
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      const authMethod = this.$auth.api_key
        ? `Bearer ${this.$auth.api_key}`
        : `Bearer ${this.$auth.oauth_access_token}`;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": authMethod,
        },
      });
    },
    async createCustomer({
      personalInformation, contactDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          personalInformation,
          contactDetails,
        },
      });
    },
    async createInternetService({
      customerId, serviceDetails, specialConditions,
    }) {
      const data = {
        ...serviceDetails,
        specialConditions,
      };
      return this._makeRequest({
        method: "POST",
        path: `/customers/${customerId}/services/internet`,
        data,
      });
    },
    async updateCustomer({
      customerId, updatedFields,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerId}`,
        data: updatedFields,
      });
    },
  },
};
