import { LinkupClient } from "linkup-sdk";

export default {
  type: "app",
  app: "linkup",
  propDefinitions: {
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "Only return results from these domains. Example: `[\"linkup.so\", \"wikipedia.org\"]`",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Exclude results from these domains. Example: `[\"reddit.com\"]`",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Only return results published on or after this date, in `YYYY-MM-DD` format. Example: `2025-01-01`",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Only return results published on or before this date, in `YYYY-MM-DD` format. Example: `2025-12-31`",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      min: 1,
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to fetch. Example: `https://docs.linkup.so`",
    },
    renderJs: {
      type: "boolean",
      label: "Render JavaScript",
      description: "Whether to render the page's JavaScript before extracting content. Slower, but needed for client-side rendered pages.",
      optional: true,
    },
    includeRawHtml: {
      type: "boolean",
      label: "Include Raw HTML",
      description: "Whether to include the raw HTML of the page in the response",
      optional: true,
    },
    extractImages: {
      type: "boolean",
      label: "Extract Images",
      description: "Whether to extract the images found on the page",
      optional: true,
    },
  },
  methods: {
    _getClient() {
      return new LinkupClient({
        apiKey: this.$auth.api_key,
      });
    },
    search(params) {
      const client = this._getClient();
      return client.search(params);
    },
    fetch(params) {
      const client = this._getClient();
      return client.fetch(params);
    },
  },
};
