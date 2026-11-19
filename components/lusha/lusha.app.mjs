import { axios } from "@pipedream/platform";
import {
  COMPANY_SIGNALS_OPTIONS,
  MAX_JOB_WAIT_MS,
  MAX_PAGE,
  SIGNALS_OPTIONS,
  V3_COMPANY_SIGNAL_TYPES,
} from "./common/constants.mjs";
import {
  getPageSize,
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
      description: "Company size ranges to search, each a JSON range object, e.g. `{\"min\": 51, \"max\": 200}`. Use **List Company Sizes Options** to get the valid ranges and pass an option `value` as is.",
      optional: true,
    },
    revenues: {
      type: "string[]",
      label: "Company Revenues",
      description: "Company revenue ranges to search, each a JSON range object, e.g. `{\"min\": 1000000, \"max\": 10000000}`. Use **List Company Revenues Options** to get the valid ranges and pass an option `value` as is.",
      optional: true,
    },
    sicCodes: {
      type: "string[]",
      label: "Company SIC Codes",
      description: "SIC industry codes of companies to search, e.g. `7372`. Use **List Company SIC Codes Options** to find valid codes.",
      optional: true,
    },
    naicsCodes: {
      type: "string[]",
      label: "Company NAICS Codes",
      description: "NAICS industry codes of companies to search, e.g. `541511`. Use **List Company NAICS Codes Options** to find valid codes.",
      optional: true,
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
      description: "Two-letter country codes of contacts to search, e.g. `US`. Use **List Contact Countries Options** to find valid codes.",
      optional: true,
    },
    seniority: {
      type: "integer[]",
      label: "Contact Seniority Levels",
      description: "Seniority level IDs of contacts to search, e.g. `4`. Use **List Contact Seniority Levels Options** to map seniority names to IDs.",
      optional: true,
    },
    departments: {
      type: "string[]",
      label: "Contact Departments",
      description: "Departments of contacts to search, e.g. `Sales`. Use **List Contact Departments Options** to find valid values.",
      optional: true,
    },
    existingDataPoints: {
      type: "string[]",
      label: "Existing Data Points",
      description: "Only return contacts that have these data points available, e.g. `work_email`. Use **List Existing Data Points Options** to find valid values.",
      optional: true,
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
      description: "Up to 100 contact IDs to enrich, taken from the `id` field of **Search Contacts** results, e.g. `[\"4389064654\"]`",
    },
    companyIds: {
      type: "string[]",
      label: "Enrich Company IDs",
      description: "Up to 100 company IDs to enrich, taken from the `id` field of **Search Companies** results, e.g. `[\"16303253\"]`",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. **This feature is used to avoid timeouts due to very long returns.**",
      default: 50,
      min: 1,
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
    companySignalTypes: {
      type: "string[]",
      label: "Company Signal Types",
      description: "Types of company signals to retrieve, e.g. `[\"surgeInHiring\", \"riskNews\"]`. `allSignals` covers every type except the four intent types (`newIntentTopic`, `intentScoreIncrease`, `intentScoreDecrease`, `intentTopicRemoved`), which must be selected explicitly.",
      options: V3_COMPANY_SIGNAL_TYPES,
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
    getContactsEnrichJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/v3/contacts/jobs/${jobId}`,
      });
    },
    // Polls a Data Waterfall job returned by Enrich Contacts and returns the contacts it completed.
    // Stops on `expired`/`failed` (or after MAX_JOB_WAIT_MS) and returns [], so callers keep the
    // results the enrich call already returned.
    async waitForContactsEnrichJob({
      $, job,
    }) {
      if (!job?.id) return [];
      const deadline = Date.now() + MAX_JOB_WAIT_MS;
      let retryAfter = job.retryAfter;
      while (Date.now() < deadline) {
        const waitMs = Math.min(Math.max(Number(retryAfter) || 1, 1) * 1000, deadline - Date.now());
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        const result = await this.getContactsEnrichJob({
          $,
          jobId: job.id,
        });
        if (result.status === "complete") return result.contacts || [];
        if (result.status !== "processing") return [];
        retryAfter = result.retryAfter;
      }
      return [];
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
    // Option lists for the prospecting filters, returned by the List * Options actions.
    async listSizeOptions(opts = {}) {
      const sizes = await this.listSizes(opts);
      return sizes.map(toRangeOption);
    },
    async listRevenueOptions(opts = {}) {
      const revenues = await this.listRevenues(opts);
      return revenues.map(toRangeOption);
    },
    async listSicCodeOptions(opts = {}) {
      const sicCodes = await this.listSicCodes(opts);
      return sicCodes.map((item) => toOption(item, CODE_OPTION_KEYS));
    },
    async listNaicsCodeOptions(opts = {}) {
      const naicsCodes = await this.listNaicsCodes(opts);
      return naicsCodes.map((item) => toOption(item, CODE_OPTION_KEYS));
    },
    async listCountryOptions(opts = {}) {
      const countries = await this.listCountries(opts);
      return countries.map((item) => toOption(item, CODE_OPTION_KEYS));
    },
    async listSeniorityOptions(opts = {}) {
      const seniorities = await this.listSeniorities(opts);
      return seniorities.map((item) => toOption(item));
    },
    async listDepartmentOptions(opts = {}) {
      const departments = await this.listDepartments(opts);
      return departments.map((item) => toOption(item));
    },
    async listExistingDataPointOptions(opts = {}) {
      const dataPoints = await this.listExistingDataPoints(opts);
      return dataPoints.map((item) => toOption(item));
    },
    getContactSignalsById(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/contacts/signals",
      });
    },
    getCompanySignalsById(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v3/companies/signals",
      });
    },
    // V3 has no identifier-based signals search, so these stay on the legacy endpoints.
    searchContactSignals(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/signals/contacts/search",
      });
    },
    searchCompanySignals(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/signals/companies/search",
      });
    },
    getContactRecommendations(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/recommendations/contacts",
      });
    },
    getCompanyRecommendations(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/recommendations/companies",
      });
    },
    getSignalOptions({
      objectType, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/api/signals/filters/${objectType}`,
      });
    },
    async *paginate({
      fn, data = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = -1;
      const size = getPageSize(maxResults);

      do {
        data.pagination = {
          page: ++page,
          size,
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

        hasMore = results.length === size && page < MAX_PAGE;

      } while (hasMore);
    },
  },
};
