import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sellsy",
  propDefinitions: {
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email of the contact",
      optional: true,
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "Number of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company",
      optional: true,
    },
    companyType: {
      type: "string",
      label: "Company Type",
      description: "Type of the company (client or prospect)",
      optional: true,
    },
    companyContact: {
      type: "string",
      label: "Company Contact",
      description: "Contact of the company",
      optional: true,
    },
    opportunityName: {
      type: "string",
      label: "Opportunity Name",
      description: "Name of the opportunity",
      required: true,
    },
    opportunityStatus: {
      type: "string",
      label: "Opportunity Status",
      description: "Status of the opportunity",
      optional: true,
    },
    opportunityDetails: {
      type: "string",
      label: "Opportunity Details",
      description: "Details of the opportunity",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      required: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      required: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      required: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Value of the opportunity",
      required: true,
    },
    expectedCloseDate: {
      type: "string",
      label: "Expected Close Date",
      description: "Expected close date of the opportunity",
      required: true,
    },
    companyEmail: {
      type: "string",
      label: "Company Email",
      description: "Email of the company",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sellsy.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact({
      firstName, lastName, email, companyName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          firstName,
          lastName,
          email,
          companyName,
        },
      });
    },
    async createOpportunity({
      opportunityName, value, expectedCloseDate, companyName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        data: {
          opportunityName,
          value,
          expectedCloseDate,
          companyName,
        },
      });
    },
    async findOrCreateCompany({
      companyName, companyEmail,
    }) {
      const company = await this._makeRequest({
        path: `/companies?name=${companyName}`,
      });
      if (company) {
        return company;
      }
      return this._makeRequest({
        method: "POST",
        path: "/companies",
        data: {
          name: companyName,
          email: companyEmail,
        },
      });
    },
  },
};
