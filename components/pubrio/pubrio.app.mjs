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
      type: "string[]",
      label: "Locations",
      description: "Location codes to filter by",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          url: "/locations",
          method: "GET",
        });
        const items = response?.data ?? response ?? [];
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    managementLevels: {
      type: "string[]",
      label: "Management Levels",
      description: "Seniority / management level codes",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          url: "/management_levels",
          method: "GET",
        });
        const items = response?.data ?? response ?? [];
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    departments: {
      type: "string[]",
      label: "Departments",
      description: "Department title codes",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          url: "/departments/title",
          method: "GET",
        });
        const items = response?.data ?? response ?? [];
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    departmentFunctions: {
      type: "string[]",
      label: "Department Functions",
      description: "Department function codes",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          url: "/departments/function",
          method: "GET",
        });
        const items = response?.data ?? response ?? [];
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    companySizes: {
      type: "string[]",
      label: "Company Sizes",
      description: "Company size range codes",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          url: "/company_sizes",
          method: "GET",
        });
        const items = response?.data ?? response ?? [];
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
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
      options: [
        "domain",
        "domain_search_id",
        "linkedin_url",
        "domain_id",
      ],
    },
    lookupTypePerson: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the person",
      options: [
        "linkedin_url",
        "people_search_id",
      ],
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
    /**
     * Returns the base URL for the Pubrio API.
     * @returns {string} The API base URL
     */
    getBaseUrl() {
      return "https://api.pubrio.com";
    },
    /**
     * Returns the authentication and content-type headers for API requests.
     * @returns {object} Headers object with API key and content type
     */
    getHeaders() {
      return {
        "pubrio-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    /**
     * Makes an authenticated HTTP request to the Pubrio API.
     * @param {object} opts - Request options passed to @pipedream/platform axios
     * @param {object} [opts.$] - Pipedream step context for exporting data
     * @param {string} [opts.method] - HTTP method (GET, POST, etc.)
     * @param {string} [opts.url] - API endpoint path
     * @param {object} [opts.data] - Request body for POST requests
     * @returns {Promise<object>} The API response
     */
    async makeRequest(opts = {}) {
      const {
        $ = this, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        baseURL: this.getBaseUrl(),
        headers: this.getHeaders(),
      });
    },
    /**
     * Splits a comma-separated string into a trimmed array of non-empty values.
     * @param {string} value - Comma-separated string to split
     * @returns {string[]|undefined} Array of trimmed values, or undefined if input is falsy
     */
    splitComma(value) {
      if (!value) return undefined;
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    },
  },
};
