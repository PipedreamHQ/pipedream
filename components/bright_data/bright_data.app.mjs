import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bright_data",
  propDefinitions: {
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset to use",
      async options() {
        const datasets = await this.listDatasets();
        return datasets.map((dataset) => ({
          label: dataset.name,
          value: dataset.id,
        }));
      },
    },
    zone: {
      type: "string",
      label: "Zone",
      description: "Zone identifier that defines your Bright Data product configuration. Each zone contains targeting rules, output preferences, and access permissions. Manage zones at: https://brightdata.com/cp/zones",
      async options({ type }) {
        const zones = await this.listZones();
        return zones?.filter((zone) => zone.type === type)?.map(({ name }) => name) || [];
      },
    },
    url: {
      type: "string",
      label: "URL",
      description: "Complete target URL to scrape. Must include protocol (http/https), be publicly accessible.",
    },
    format: {
      type: "string",
      label: "Format",
      description: "Output format of the response",
      options: [
        "json",
        "raw",
      ],
    },
    method: {
      type: "string",
      label: "Method",
      description: "HTTP method to use for the request",
      options: [
        "GET",
        "POST",
      ],
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter ISO 3166-1 country code for proxy location",
      optional: true,
    },
    dataFormat: {
      type: "string",
      label: "Data Format",
      description: "Additional response format transformation: `markdown` converts HTML content to clean markdown format, `screenshot` captures a PNG image of the rendered page.",
      options: [
        "markdown",
        "screenshot",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.brightdata.com";
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
    listDatasets(opts = {}) {
      return this._makeRequest({
        path: "/datasets/list",
        ...opts,
      });
    },
    listZones(opts = {}) {
      return this._makeRequest({
        path: "/zone/get_active_zones",
        ...opts,
      });
    },
    scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: "/datasets/v3/scrape",
        method: "POST",
        ...opts,
      });
    },
    requestWebsite(opts = {}) {
      return this._makeRequest({
        path: "/request",
        method: "POST",
        ...opts,
      });
    },
  },
};
