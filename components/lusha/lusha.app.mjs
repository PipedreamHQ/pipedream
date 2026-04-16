import { axios } from "@pipedream/platform";
import {
  COMPANY_SIGNALS_OPTIONS,
  SIGNALS_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "lusha",
  propDefinitions: {
    companyNames: {
      type: "string[]",
      label: "Company Names",
      description: "Names of companies to search",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Company Domains",
      description: "Domains of companies to search",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Company Locations",
      description: "Location country filters for companies to search. Eg. `United States`, `Canada`, `United Kingdom`, etc.",
      optional: true,
    },
    sizes: {
      type: "string[]",
      label: "Company Sizes",
      description: "Size ranges of companies to search",
      optional: true,
      async options() {
        const sizes = await this.listSizes();
        return sizes.map((size) => JSON.stringify(size));
      },
    },
    revenues: {
      type: "string[]",
      label: "Company Revenues",
      description: "Revenue ranges of companies to search",
      optional: true,
      async options() {
        const revenues = await this.listRevenues();
        return revenues.map((revenue) => JSON.stringify(revenue));
      },
    },
    sicCodes: {
      type: "string[]",
      label: "Company SIC Codes",
      description: "SIC codes of companies to search",
      optional: true,
      async options() {
        const sicCodes = await this.listSicCodes();
        return sicCodes.map(({
          code: value, label,
        }) => ({
          value,
          label,
        }));
      },
    },
    naicsCodes: {
      type: "string[]",
      label: "Company NAICS Codes",
      description: "NAICS codes of companies to search",
      optional: true,
      async options() {
        const naicsCodes = await this.listNaicsCodes();
        return naicsCodes.map(({
          code: value, label,
        }) => ({
          value,
          label,
        }));
      },
    },
    contactNames: {
      type: "string[]",
      label: "Contact Names",
      description: "Names of contacts to search",
      optional: true,
    },
    jobTitles: {
      type: "string[]",
      label: "Contact Job Titles",
      description: "Job titles of contacts to search",
      optional: true,
    },
    jobTitlesExactMatch: {
      type: "string[]",
      label: "Exact Match Contact Job Titles",
      description: "Exact job titles of contacts to search",
      optional: true,
    },
    countries: {
      type: "string[]",
      label: "Contact Countries",
      description: "Country codes of contacts to search",
      optional: true,
      async options() {
        const countries = await this.listCountries();
        return countries.map(({
          code: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    seniority: {
      type: "integer[]",
      label: "Contact Seniority Levels",
      description: "Seniority levels of contacts to search",
      optional: true,
      async options() {
        const senorities = await this.listSeniorities();
        return senorities.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    departments: {
      type: "string[]",
      label: "Contact Departments",
      description: "Departments of contacts to search",
      optional: true,
      async options() {
        return await this.listDepartments();
      },
    },
    existingDataPoints: {
      type: "string[]",
      label: "Existing Data Points",
      description: "Existing data points of contacts to filter by",
      optional: true,
      async options() {
        return await this.listExistingDataPoints();
      },
    },
    location: {
      type: "string[]",
      label: "Contact Locations",
      description: `Location filters for contacts to search. Each entry should be a JSON object with the following optional fields:

**Available Fields:**
- \`continent\` - The continent name (e.g., "North America")
- \`country\` - The country name (e.g., "United States")
- \`country_grouping\` - Country grouping code (e.g., "na" for North America)
- \`state\` - The state or region name (e.g., "New York")
- \`city\` - The city name (e.g., "New York")

**Example JSON:**
\`\`\`json
[
  {
    "continent": "North America",
    "country": "United States",
    "state": "New York",
    "city": "New York"
  }
]
\`\`\``,
      optional: true,
    },
    requestId: {
      type: "string",
      label: "Enrich Contact Request ID",
      description: "The request ID generated from the contact search response",
    },
    contactIds: {
      type: "string[]",
      label: "Enrich Contact IDs",
      description: "Array of contact IDs to enrich",
    },
    companyIds: {
      type: "string[]",
      label: "Enrich Company IDs",
      description: "Array of company IDs to enrich",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. **This feature is used to avoid timeouts due to very long returns.**",
      default: 50,
    },
    signals: {
      type: "string[]",
      label: "Signals",
      description: "Types of signals to retrieve",
      options: SIGNALS_OPTIONS,
    },
    companySignals: {
      type: "string[]",
      label: "Company Signals",
      description: "Types of company signals to retrieve",
      options: COMPANY_SIGNALS_OPTIONS,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for signal retrieval **Format: YYYY-MM-DD**",
      optional: true,
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
    searchSingleContact(opts = {}) {
      return this._makeRequest({
        path: "/v2/person",
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
    searchSingleCompany(opts = {}) {
      return this._makeRequest({
        path: "/v2/company",
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
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/contacts/departments",
        ...opts,
      });
    },
    listSeniorities(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/contacts/seniority",
        ...opts,
      });
    },
    listExistingDataPoints(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/contacts/existing_data_points",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/contacts/all_countries",
        ...opts,
      });
    },
    listSizes(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/companies/sizes",
        ...opts,
      });
    },
    listRevenues(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/companies/revenues",
        ...opts,
      });
    },
    listSicCodes(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/companies/sics",
        ...opts,
      });
    },
    listNaicsCodes(opts = {}) {
      return this._makeRequest({
        path: "/prospecting/filters/companies/naics",
        ...opts,
      });
    },
    getContactSignalsById(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/signals/contacts",
        ...opts,
      });
    },
    searchContactSignals(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/signals/contacts/search",
        ...opts,
      });
    },
    searchCompanySignals(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/signals/companies/search",
        ...opts,
      });
    },
    getContactRecommendations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/recommendations/contacts",
        ...opts,
      });
    },
    getCompanyRecommendations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/recommendations/companies",
        ...opts,
      });
    },
    getSignalOptions({
      objectType, ...opts
    }) {
      return this._makeRequest({
        path: `/api/signals/filters/${objectType}`,
        ...opts,
      });
    },
    async *paginate({
      fn, data = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = -1;

      do {
        data.pages = {
          page: ++page,
          size: 50,
        };
        const response = await fn({
          data,
          ...opts,
        });
        const results = response.data || [];
        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = results.length;

      } while (hasMore);
    },
  },
};
