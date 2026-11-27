import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dealport",
  propDefinitions: {
    q: {
      type: "string",
      label: "Search Query",
      description: "Optional company name prefix filter (for example `Buckeye`).",
      optional: true,
    },
    state: {
      type: "string",
      label: "US State Code",
      description: "Two-letter US state code such as `OH`, `TX`, or `FL`.",
      optional: true,
    },
    cities: {
      type: "string[]",
      label: "Cities",
      description: "City names within the selected US state.",
      optional: true,
    },
    counties: {
      type: "string[]",
      label: "Counties",
      description: "County names within the selected US state.",
      optional: true,
    },
    naics: {
      type: "string[]",
      label: "NAICS Codes",
      description: "2-to-6 digit NAICS industry codes such as `238220` or `332710`.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Company website host or registrable domain such as `example.com`.",
      optional: true,
    },
    minEmployees: {
      type: "integer",
      label: "Minimum Employees",
      description: "Minimum employee headcount.",
      optional: true,
    },
    maxEmployees: {
      type: "integer",
      label: "Maximum Employees",
      description: "Maximum employee headcount.",
      optional: true,
    },
    minRevenue: {
      type: "integer",
      label: "Minimum Revenue (USD)",
      description: "Minimum annual revenue in USD.",
      optional: true,
    },
    maxRevenue: {
      type: "integer",
      label: "Maximum Revenue (USD)",
      description: "Maximum annual revenue in USD.",
      optional: true,
    },
    independent: {
      type: "boolean",
      label: "Independent Only",
      description: "Exclude SEC filers, nonprofits, government bodies, membership groups, and HOAs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of Records to return per page (`1` to `50`, default `25`).",
      optional: true,
      default: 25,
    },
    cursor: {
      type: "string",
      label: "Pagination Cursor",
      description: "Optional `next_cursor` token from a previous search page.",
      optional: true,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Dealport company UUID returned by Search Companies, Preview Market, or Match Company List.",
    },
    person: {
      type: "string",
      label: "Principal Name",
      description: "Optional full name of a specific principal listed on the company Record.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.dealport.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    previewCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/preview",
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/companies",
        ...opts,
      });
    },
    searchBuildings(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/buildings",
        ...opts,
      });
    },
    getRecord({
      recordId,
      ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/records/${encodeURIComponent(recordId)}`,
        ...opts,
      });
    },
    findOwner(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/owners",
        ...opts,
      });
    },
    findContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    matchCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/match",
        ...opts,
      });
    },
  },
};
