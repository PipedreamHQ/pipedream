import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "olostep",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape, including the protocol, e.g. `https://docs.olostep.com`",
    },
    includeUrls: {
      type: "string[]",
      label: "Include URLs",
      description: "URL path patterns to include, in glob syntax, e.g. `[\"/blog/**\"]`",
      optional: true,
    },
    excludeUrls: {
      type: "string[]",
      label: "Exclude URLs",
      description: "URL path patterns to exclude, in glob syntax, e.g. `[\"/careers/**\"]`. Excluded URLs take precedence over included URLs.",
      optional: true,
    },
    includeSubdomain: {
      type: "boolean",
      label: "Include Subdomains",
      description: "Whether to include subdomains of the website, e.g. `true` to also include `blog.example.com` when the URL is `https://example.com`",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Sort the URLs by relevance to this query, e.g. `pricing`",
      optional: true,
    },
    topN: {
      type: "integer",
      label: "Top N",
      description: "Keep only the N URLs most relevant to **Search Query**, e.g. `10`. Only applies when **Search Query** is set.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country to load the pages from, as a two-letter code, e.g. `US`. [See the documentation](https://docs.olostep.com/api-reference/scrapes/create) for supported values.",
      optional: true,
      options: [
        {
          label: "United States",
          value: "US",
        },
        {
          label: "Canada",
          value: "CA",
        },
        {
          label: "Italy",
          value: "IT",
        },
        {
          label: "India",
          value: "IN",
        },
        {
          label: "United Kingdom",
          value: "GB",
        },
        {
          label: "Japan",
          value: "JP",
        },
        {
          label: "Mexico",
          value: "MX",
        },
        {
          label: "Australia",
          value: "AU",
        },
        {
          label: "Indonesia",
          value: "ID",
        },
        {
          label: "Russia",
          value: "RU",
        },
        {
          label: "Random",
          value: "RANDOM",
        },
      ],
    },
    webhook: {
      type: "string",
      label: "Webhook URL",
      description: "Public URL that receives a POST request when the job completes, e.g. `https://example.com/webhooks/olostep`",
      optional: true,
    },
    includeContent: {
      type: "boolean",
      label: "Include Content",
      description: "Whether to also return each page's Markdown content, e.g. `true`. Each page is fetched separately, so keep **Limit** small.",
      optional: true,
      default: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of pages to return, e.g. `10`",
      optional: true,
      min: 1,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "The `cursor` field from the previous **Map Website**, **Get Crawl Results** or **Get Batch Results** response for the same website, crawl or batch, to get the next page of results, e.g. `10`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.olostep.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    scrapeUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrapes",
        ...opts,
      });
    },
    searchWeb(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/searches",
        ...opts,
      });
    },
    answerQuestion(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/answers",
        ...opts,
      });
    },
    mapWebsite(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/maps",
        ...opts,
      });
    },
    startCrawl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/crawls",
        ...opts,
      });
    },
    getCrawl({
      crawlId, ...opts
    }) {
      return this._makeRequest({
        path: `/crawls/${crawlId}`,
        ...opts,
      });
    },
    listCrawlPages({
      crawlId, ...opts
    }) {
      return this._makeRequest({
        path: `/crawls/${crawlId}/pages`,
        ...opts,
      });
    },
    startBatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches",
        ...opts,
      });
    },
    getBatch({
      batchId, ...opts
    }) {
      return this._makeRequest({
        path: `/batches/${batchId}`,
        ...opts,
      });
    },
    listBatchItems({
      batchId, ...opts
    }) {
      return this._makeRequest({
        path: `/batches/${batchId}/items`,
        ...opts,
      });
    },
    retrieveContent(opts = {}) {
      return this._makeRequest({
        path: "/retrieve",
        ...opts,
      });
    },
    async addMarkdown($, items) {
      for (const item of items) {
        if (!item.retrieve_id) continue;
        const content = await this.retrieveContent({
          $,
          params: {
            retrieve_id: item.retrieve_id,
            formats: "markdown",
          },
        });
        item.markdown_content = content?.markdown_content ?? null;
      }
      return items;
    },
  },
};
