import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "olostep",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape, including `https://`, e.g. `https://docs.olostep.com`",
    },
    includeUrls: {
      type: "string[]",
      label: "Include URLs",
      description: "URL path patterns to include, in glob syntax, e.g. `/blog/**`",
      optional: true,
    },
    excludeUrls: {
      type: "string[]",
      label: "Exclude URLs",
      description: "URL path patterns to exclude, in glob syntax, e.g. `/careers/**`. Excluded URLs take precedence over included URLs.",
      optional: true,
    },
    includeSubdomain: {
      type: "boolean",
      label: "Include Subdomains",
      description: "Include subdomains of the website",
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
      description: "Keep only the N most relevant URLs for the **Search Query**",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country to load the page from. [See the documentation](https://docs.olostep.com/api-reference/scrapes/create)",
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
      description: "Public `https://` URL that receives a POST request when the job completes",
      optional: true,
    },
    includeContent: {
      type: "boolean",
      label: "Include Content",
      description: "Also fetch the Markdown content of each page. Each page is one extra request, so keep **Limit** small.",
      optional: true,
      default: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of pages to return",
      optional: true,
      default: 10,
      min: 1,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "The `cursor` returned by a previous call, to get the next page of results",
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
    scrape(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrapes",
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/searches",
        ...opts,
      });
    },
    answer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/answers",
        ...opts,
      });
    },
    map(opts = {}) {
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
    retrieve(opts = {}) {
      return this._makeRequest({
        path: "/retrieve",
        ...opts,
      });
    },
    async addMarkdown($, items) {
      for (const item of items) {
        if (!item.retrieve_id) continue;
        const content = await this.retrieve({
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
