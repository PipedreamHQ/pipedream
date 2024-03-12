import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splynx",
  version: "0.0.1",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the customer",
    },
    partnerId: {
      type: "integer",
      label: "Partner ID",
      description: "Partner id. You can get it at page \"Administration / Partners\"",
    },
    locationId: {
      type: "integer",
      label: "Location ID",
      description: "Location id. You can get it at page \"Administration / Locations\"",
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category of the customer",
      options: [
        {
          label: "Private person",
          value: "person",
        },
        {
          label: "Company",
          value: "company",
        },
      ],
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login of the user",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the customer",
      optional: true,
      options: [
        "new",
        "active",
        "blocked",
        "disabled",
      ],
      default: "new",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    billingEmail: {
      type: "string",
      label: "Billing Email",
      description: "The billing email of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer, e.g. `555-0134`",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the customer",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer",
      optional: true,
    },
    dateAdd: {
      type: "string",
      label: "Date Added",
      description: "The date the customer was added (defaults to current date)",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer to update, or provide a customer ID.",
      async options() {
        const customers = await this.listCustomers();
        return customers?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
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
      return `https://${this.splynx.$auth.subdomain}.splynx.app/api/2.0/admin`;
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
    async listCustomers() {
      return this._makeRequest({
        url: "/customers/customer",
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers/customer",
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
