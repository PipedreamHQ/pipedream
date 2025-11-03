import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firecrawl",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to start crawling from",
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
    crawlId: {
      type: "string",
      label: "Crawl ID",
      description: "The ID of a crawl job (e.g. as returned by the **Crawl URL** action)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.firecrawl.dev";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, version = "v1", ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${version}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    crawl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/crawl",
        version: "v2",
        ...opts,
      });
    },
    getCrawlStatus({
      crawlId, ...opts
    }) {
      return this._makeRequest({
        path: `/crawl/${crawlId}`,
        ...opts,
      });
    },
    scrape(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrape",
        ...opts,
      });
    },
    extract(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/extract",
        ...opts,
      });
    },
    getExtractStatus({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/extract/${id}`,
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search",
        ...opts,
      });
    },
  },
};
