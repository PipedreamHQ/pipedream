import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lusha",
  propDefinitions: {
    companyNames: {
      type: "string[]",
      label: "Company Names",
      description: "Names of companies to search.",
    },
    domains: {
      type: "string[]",
      label: "Company Domains",
      description: "Domains of companies to search.",
    },
    locations: {
      type: "string[]",
      label: "Company Locations",
      description: "Location filters for companies to search.",
    },
    sizes: {
      type: "string[]",
      label: "Company Sizes",
      description: "Size ranges of companies to search.",
    },
    revenues: {
      type: "string[]",
      label: "Company Revenues",
      description: "Revenue ranges of companies to search.",
    },
    sicCodes: {
      type: "string[]",
      label: "Company SIC Codes",
      description: "SIC codes of companies to search.",
    },
    naicsCodes: {
      type: "string[]",
      label: "Company NAICS Codes",
      description: "NAICS codes of companies to search.",
    },
    contactNames: {
      type: "string[]",
      label: "Contact Names",
      description: "Names of contacts to search.",
    },
    jobTitles: {
      type: "string[]",
      label: "Contact Job Titles",
      description: "Job titles of contacts to search.",
    },
    jobTitlesExactMatch: {
      type: "string[]",
      label: "Exact Match Contact Job Titles",
      description: "Exact job titles of contacts to search.",
    },
    countries: {
      type: "string[]",
      label: "Contact Countries",
      description: "Country codes of contacts to search.",
    },
    seniority: {
      type: "integer[]",
      label: "Contact Seniority Levels",
      description: "Seniority levels of contacts to search.",
    },
    departments: {
      type: "string[]",
      label: "Contact Departments",
      description: "Departments of contacts to search.",
    },
    existingDataPoints: {
      type: "string[]",
      label: "Existing Data Points",
      description: "Existing data points of contacts to filter by.",
    },
    location: {
      type: "string[]",
      label: "Contact Locations",
      description: "Location filters for contacts to search (JSON strings).",
    },
    requestId: {
      type: "string",
      label: "Enrich Contact Request ID",
      description: "The request ID generated from the contact search response.",
    },
    contactIds: {
      type: "string[]",
      label: "Enrich Contact IDs",
      description: "Array of contact IDs to enrich.",
    },
    companyIds: {
      type: "string[]",
      label: "Enrich Company IDs",
      description: "Array of company IDs to enrich.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lusha.com";
    },
    _headers() {
      return {
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospecting/contact/search",
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospecting/company/search",
        ...opts,
      });
    },
    enrichContacts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospecting/contact/enrich",
        ...opts,
      });
    },
    enrichCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospecting/company/enrich",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.pages = {
          page: ++page,
        };
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
