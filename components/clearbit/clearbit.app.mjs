import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clearbit",
  propDefinitions: {
    companyName: {
      label: "Company Name",
      type: "string",
      description: "The name of the company.",
    },
    linkedin: {
      label: "LinkedIn",
      type: "string",
      description: "The LinkedIn URL for the company.",
      optional: true,
    },
    twitter: {
      label: "Twitter",
      type: "string",
      description: "The Twitter handle for the company.",
      optional: true,
    },
    facebook: {
      label: "Facebook",
      type: "string",
      description: "The Facebook URL for the company.",
      optional: true,
    },
    webhookUrl: {
      label: "Webhook URL",
      type: "string",
      description: "A webhook URL that results will be sent to.",
      optional: true,
    },
    email: {
      label: "Email",
      type: "string",
      description: "The email address to look up.",
    },
    domain: {
      label: "Domain",
      type: "string",
      description: "The domain to look up.",
    },
    query: {
      label: "Query",
      type: "string",
      description: "Search query string.",
    },
    page: {
      label: "Page",
      type: "string",
      description: "Which results page to show.",
      optional: true,
    },
    pageSize: {
      label: "Page Size",
      type: "integer",
      description: "The amount of results to return per page.",
      optional: true,
    },
    limit: {
      label: "Limit",
      type: "integer",
      description: "How many paginated results to return in total.",
      optional: true,
    },
    errorIfNoRecords: {
      type: "boolean",
      label: "Handle lack of records found as an error?",
      description: "Defaults to `false`. If no records are found, the step will still be considered a success. If `false`, the step will return an error and workflow execution will stop.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _getCompanyBaseUrl(version) {
      return `https://company.clearbit.com/${version}`;
    },
    _getPersonBaseUrl() {
      return "https://person.clearbit.com/v2";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.secret_api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      const res = {
        ...opts,
        headers: this._getHeaders(),
      };
      return res;
    },
    companyNameToDomain(ctx = this, companyName) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getCompanyBaseUrl("v1")}/domains/find`,
        params: {
          name: companyName,
        },
      }));
    },
    domainLookup(ctx = this, params) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getCompanyBaseUrl("v2")}/companies/find`,
        params,
      }));
    },
    emailLookup(ctx = this, params) {
      console.log(params);
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getPersonBaseUrl()}/people/find`,
        params,
      }));
    },
  },
};
