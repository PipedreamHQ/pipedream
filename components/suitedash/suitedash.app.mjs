import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "suitedash",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company in SuiteDash.",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the new company.",
    },
    companyRole: {
      type: "string",
      label: "Company Role",
      description: "The role of the new company.",
    },
    companyWebsite: {
      type: "string",
      label: "Company Website",
      description: "The website of the company.",
      optional: true,
    },
    companyAddress: {
      type: "string",
      label: "Company Address",
      description: "The address of the company.",
      optional: true,
    },
    companyLogo: {
      type: "string",
      label: "Company Logo",
      description: "The logo of the company.",
      optional: true,
    },
    contactFirstName: {
      type: "string",
      label: "Contact First Name",
      description: "The first name of the new contact.",
    },
    contactLastName: {
      type: "string",
      label: "Contact Last Name",
      description: "The last name of the new contact.",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the new contact.",
    },
    contactRole: {
      type: "string",
      label: "Contact Role",
      description: "The role of the new contact.",
      optional: true,
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Whether to send a welcome email to the new contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.suitedash.com/secure-api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
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
    async createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/company",
        ...opts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    async updateCompany(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/company/${opts.companyId}`,
        ...opts,
      });
    },
  },
};
