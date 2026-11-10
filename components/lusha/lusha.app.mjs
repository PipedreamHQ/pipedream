import { axios } from "@pipedream/platform";
import {
  COMPANY_SIGNALS_OPTIONS,
  MAX_PAGE,
  PAGE_SIZE,
  SIGNALS_OPTIONS,
} from "./common/constants.mjs";
import {
  toOption,
  toRangeOption,
} from "./common/utils.mjs";

const CODE_OPTION_KEYS = {
  valueKeys: [
    "code",
    "value",
    "id",
    "name",
  ],
};

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
        return sizes.map(toRangeOption);
      },
    },
    revenues: {
      type: "string[]",
      label: "Company Revenues",
      description: "Revenue ranges of companies to search",
      optional: true,
      async options() {
        const revenues = await this.listRevenues();
        return revenues.map(toRangeOption);
      },
    },
    sicCodes: {
      type: "string[]",
      label: "Company SIC Codes",
      description: "SIC codes of companies to search",
      optional: true,
      async options() {
        const sicCodes = await this.listSicCodes();
        return sicCodes.map((item) => toOption(item, CODE_OPTION_KEYS));
      },
    },
    naicsCodes: {
      type: "string[]",
      label: "Company NAICS Codes",
      description: "NAICS codes of companies to search",
      optional: true,
      async options() {
        const naicsCodes = await this.listNaicsCodes();
        return naicsCodes.map((item) => toOption(item, CODE_OPTION_KEYS));
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
        return countries.map((item) => toOption(item, CODE_OPTION_KEYS));
      },
    },
    seniority: {
      type: "integer[]",
      label: "Contact Seniority Levels",
      description: "Seniority levels of contacts to search",
      optional: true,
      async options() {
        const seniorities = await this.listSeniorities();
        return seniorities.map((item) => toOption(item));
      },
    },
    departments: {
      type: "string[]",
      label: "Contact Departments",
      description: "Departments of contacts to search",
      optional: true,
      async options() {
        const departments = await this.listDepartments();
        return departments.map((item) => toOption(item));
      },
    },
    existingDataPoints: {
      type: "string[]",
      label: "Existing Data Points",
      description: "Existing data points of contacts to filter by",
      optional: true,
      async options() {
        const dataPoints = await this.listExistingDataPoints();
        return dataPoints.map((item) => toOption(item));
      },
    },
    location: {
      type: "string[]",
      label: "Contact Locations",
      description: `Location filters for contacts to search. Each entry should be a JSON object with the following optional fields:

**Available Fields:**
- \`continent\` - The continent name (e.g., "North America")
- \`country\` - The country name (e.g., "United States")
- \`countryGrouping\` - Country grouping code (e.g., "na" for North America)
- \`countryIso2\` - Two-letter ISO country code (e.g., "US")
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
    contactIds: {
      type: "string[]",
      label: "Enrich Contact IDs",
      description: "Up to 100 contact IDs to enrich, taken from the `id` field of **Search Contacts** results",
    },
    companyIds: {
      type: "string[]",
      label: "Enrich Company IDs",
      description: "Up to 100 company IDs to enrich, taken from the `id` field of **Search Companies** results",
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
    searchAndEnrichContacts(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/contacts/search-and-enrich",
      });
    },
    searchAndEnrichCompanies(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/companies/search-and-enrich",
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/contacts/prospecting",
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/companies/prospecting",
      });
    },
    enrichContacts(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/contacts/enrich",
      });
    },
    enrichCompanies(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/companies/enrich",
      });
    },
    async listContactFilterValues({
      filterType, ...opts
    }) {
      const { values = [] } = await this._makeRequest({
        ...opts,
        path: `/v3/contacts/prospecting/filters/${filterType}`,
      });
      return values;
    },
    async listCompanyFilterValues({
      filterType, ...opts
    }) {
      const { values = [] } = await this._makeRequest({
        ...opts,
        path: `/v3/companies/prospecting/filters/${filterType}`,
      });
      return values;
    },
    listDepartments(opts = {}) {
      return this.listContactFilterValues({
        ...opts,
        filterType: "departments",
      });
    },
    listSeniorities(opts = {}) {
      return this.listContactFilterValues({
        ...opts,
        filterType: "seniority",
      });
    },
    listExistingDataPoints(opts = {}) {
      return this.listContactFilterValues({
        ...opts,
        filterType: "existingDataPoints",
      });
    },
    listCountries(opts = {}) {
      return this.listContactFilterValues({
        ...opts,
        filterType: "countries",
      });
    },
    listSizes(opts = {}) {
      return this.listCompanyFilterValues({
        ...opts,
        filterType: "sizes",
      });
    },
    listRevenues(opts = {}) {
      return this.listCompanyFilterValues({
        ...opts,
        filterType: "revenues",
      });
    },
    listSicCodes(opts = {}) {
      return this.listCompanyFilterValues({
        ...opts,
        filterType: "sics",
      });
    },
    listNaicsCodes(opts = {}) {
      return this.listCompanyFilterValues({
        ...opts,
        filterType: "naics",
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
        data.pagination = {
          page: ++page,
          size: PAGE_SIZE,
        };
        const response = await fn({
          data,
          ...opts,
        });
        const results = response.results || [];
        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = results.length === PAGE_SIZE && page < MAX_PAGE;

      } while (hasMore);
    },
  },
};
