import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dataforb2b",
  propDefinitions: {
    filters: {
      type: "object",
      label: "Filters",
      description:
        "Filter object with `op` (`and`|`or`) and `conditions` array. Each condition: `{ column, type, value }`. E.g. `{ \"op\": \"and\", \"conditions\": [{ \"column\": \"current_title\", \"type\": \"like\", \"value\": \"Engineer\" }] }`",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of results to return (default: 25, max: 1000).",
      optional: true,
      default: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Pagination offset (default: 0).",
      optional: true,
      default: 0,
    },
    enrichLive: {
      type: "boolean",
      label: "Enrich Live",
      description: "Whether to enrich results with live data (default: true).",
      optional: true,
      default: true,
    },
    lookalikeProfile: {
      type: "string",
      label: "Lookalike Profile",
      description:
        "LinkedIn URL or public_id of a profile to find similar people. Mutually exclusive with filters.",
      optional: true,
    },
    lookalikeUseCase: {
      type: "string",
      label: "Lookalike Use Case",
      description: "Use case context for lookalike search.",
      optional: true,
      default: "sales",
      options: [
        "sales",
        "recruiter",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Natural language search query (minimum 3 characters).",
    },
    category: {
      type: "string",
      label: "Category",
      description: "Whether to search people or companies.",
      options: [
        "people",
        "company",
      ],
    },
    profileIdentifier: {
      type: "string",
      label: "Profile Identifier",
      description:
        "Profile ID (e.g. `prof_abc123`) or LinkedIn URL of the person to enrich.",
    },
    companyIdentifier: {
      type: "string",
      label: "Company Identifier",
      description:
        "Company identifier: slug (e.g. `google`), domain, or LinkedIn URL.",
    },
    enrichProfile: {
      type: "boolean",
      label: "Enrich Full Profile",
      description: "Retrieve full profile data.",
      optional: true,
      default: false,
    },
    enrichWorkEmail: {
      type: "boolean",
      label: "Enrich Work Email",
      description: "Retrieve verified professional email address.",
      optional: true,
      default: false,
    },
    enrichPersonalEmail: {
      type: "boolean",
      label: "Enrich Personal Email",
      description: "Retrieve personal email address.",
      optional: true,
      default: false,
    },
    enrichPhone: {
      type: "boolean",
      label: "Enrich Phone",
      description: "Retrieve phone number.",
      optional: true,
      default: false,
    },
    enrichGithub: {
      type: "boolean",
      label: "Enrich GitHub Profile",
      description: "Retrieve GitHub profile data.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dataforb2b.ai";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _headers() {
      return {
        "api_key": this._apiKey(),
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      method = "POST",
      path,
      data,
      ...args
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        data,
        ...args,
      });
    },
    searchPeople(args = {}) {
      return this._makeRequest({
        path: "/search/people",
        ...args,
      });
    },
    searchCompanies(args = {}) {
      return this._makeRequest({
        path: "/search/companies",
        ...args,
      });
    },
    agentSearch(args = {}) {
      return this._makeRequest({
        path: "/search/llm",
        ...args,
      });
    },
    textToFilters(args = {}) {
      return this._makeRequest({
        path: "/search/llm/filters",
        ...args,
      });
    },
    enrichProfile(args = {}) {
      return this._makeRequest({
        path: "/enrich/profile",
        ...args,
      });
    },
    enrichCompany(args = {}) {
      return this._makeRequest({
        path: "/enrich/company",
        ...args,
      });
    },
  },
};
