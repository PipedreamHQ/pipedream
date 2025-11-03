import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "serphouse",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to search",
      async options({ type }) {
        const { results } = await this.listDomains();
        if (type) {
          return results.filter((domain) => domain.includes(type));
        }
        return results;
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language to use for the search",
      async options({ domain }) {
        if (!domain) {
          return [];
        }
        const type = this.getDomainType(domain);
        const { results } = await this.listLanguages({
          type,
        });
        return Object.entries(results).map(([
          key,
          value,
        ]) => ({
          label: value,
          value: key,
        }));
      },
    },
    locationAlert: {
      type: "alert",
      alertType: "info",
      content: "Please enter a search query in Locations to list location options.",
    },
    locationId: {
      type: "string",
      label: "Location",
      description: "Search for a location or enter a location ID. Required for Google and Bing searches.",
      useQuery: true,
      async options({
        domain, query,
      }) {
        if (!domain || !query) {
          return [];
        }
        const type = this.getDomainType(domain);
        const { results } = await this.listLocations({
          params: {
            q: query,
            type,
          },
        });
        return results.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search phrase that you want to search",
    },
    dateRange: {
      type: "string",
      label: "Date Range",
      description: "Parameter defines the date range for the search",
      optional: true,
      options: [
        {
          label: "Past hour",
          value: "h",
        },
        {
          label: "Past 24 hours",
          value: "d",
        },
        {
          label: "Past week",
          value: "w",
        },
        {
          label: "Past month",
          value: "m",
        },
        {
          label: "Past year",
          value: "y",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.serphouse.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getDomainType(domain) {
      const type = domain.includes("google")
        ? "google"
        : domain.includes("bing")
          ? "bing"
          : domain.includes("yahoo")
            ? "yahoo"
            : "other";
      if (type === "other") {
        throw new ConfigurationError("Invalid domain");
      }
      return type;
    },
    performSearch(opts = {}) {
      return this._makeRequest({
        path: "/serp/live",
        ...opts,
      });
    },
    googleJobsSearch(opts = {}) {
      return this._makeRequest({
        path: "/google-jobs-api",
        method: "post",
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        path: "/domain/list",
        ...opts,
      });
    },
    listLanguages({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/language/list/${type}`,
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/location/search",
        ...opts,
      });
    },
  },
};
