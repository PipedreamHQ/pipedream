import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pubrio",
  propDefinitions: {
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name to search for",
      optional: true,
    },
    domains: {
      type: "string",
      label: "Domains",
      description: "Comma-separated company domains (e.g. `google.com,apple.com`)",
      optional: true,
    },
    locations: {
      type: "string",
      label: "Locations",
      description: "Comma-separated location codes",
      optional: true,
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "General search term",
      optional: true,
    },
    lookupTypeDomain: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the company",
      options: ["domain", "domain_search_id", "linkedin_url", "domain_id"],
    },
    lookupTypePerson: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the person",
      options: ["linkedin_url", "people_search_id"],
    },
    lookupValue: {
      type: "string",
      label: "Value",
      description: "The domain, LinkedIn URL, or ID value",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Results per page (max 25)",
      default: 25,
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.pubrio.com";
    },
    getHeaders() {
      return {
        "pubrio-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(opts = {}) {
      const { $ = this, ...otherOpts } = opts;
      return axios($, {
        ...otherOpts,
        baseURL: this.getBaseUrl(),
        headers: this.getHeaders(),
      });
    },
    splitComma(value) {
      if (!value) return undefined;
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    },
  },
};
