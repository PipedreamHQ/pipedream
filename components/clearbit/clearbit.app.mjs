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
    maxResults: {
      label: "Max Results",
      type: "integer",
      description: "Maximum results to be fetched. Defaults to `100`.",
      optional: true,
    },
    pageSize: {
      label: "Page Size",
      type: "integer",
      description: "The amount of results to return per page.",
      optional: true,
    },
    errorIfNoRecords: {
      type: "boolean",
      label: "Handle lack of records found as an error?",
      description: "Defaults to `false`. If `false` and no records are found, the step will still be considered a success. If `true` and no records are found, the step will return an error and workflow execution will stop.",
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
    _getDiscoveryUrl() {
      return "https://discovery.clearbit.com/v1";
    },
    _getProspectorUrl() {
      return "https://prospector.clearbit.com/v1";
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
    async paginate(ctx, maxResults, apiRequestFunction, params) {
      let page = 1;
      let items = [];
      while (true) {
        const res = await apiRequestFunction(ctx, {
          ...params,
          page,
          page_size: 20,
        });

        if (res.results?.length == 0) {
          break;
        }

        items.push(...res.results);
        if (items.length >= maxResults) {
          items = items.slice(0, maxResults);
          break;
        }
        page++;
      }
      return items;
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
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getPersonBaseUrl()}/people/find`,
        params,
      }));
    },
    findCompanies(ctx = this, params) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getDiscoveryUrl()}/companies/search`,
        params,
      }));
    },
    findContacts(ctx = this, params) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getProspectorUrl()}/people/search`,
        params,
      }));
    },
  },
};
