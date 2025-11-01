import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "exa",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query string",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to find similar links for. Example: `https://arxiv.org/abs/2307.06435`",
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "List of URLs to retrieve contents for",
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Number of search results to return. Maximum 10 for `keyword` search, 100 for `neural` search",
      optional: true,
    },
    type: {
      type: "string",
      label: "Search Type",
      description: "The type of search to perform",
      optional: true,
      options: [
        "auto",
        "neural",
        "keyword",
        "fast",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "A data category to focus on",
      optional: true,
      options: [
        "company",
        "research paper",
        "news",
        "pdf",
        "github",
        "tweet",
        "personal site",
        "linkedin profile",
        "financial report",
      ],
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "List of domains to include in the search results",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "List of domains to exclude from the search results",
      optional: true,
    },
    startCrawlDate: {
      type: "string",
      label: "Start Crawl Date",
      description: "Results will only include links crawled after this date (ISO 8601 format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    endCrawlDate: {
      type: "string",
      label: "End Crawl Date",
      description: "Results will only include links crawled before this date (ISO 8601 format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    startPublishedDate: {
      type: "string",
      label: "Start Published Date",
      description: "Results will only include links published after this date (ISO 8601 format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    endPublishedDate: {
      type: "string",
      label: "End Published Date",
      description: "Results will only include links published before this date (ISO 8601 format). Example: `2025-01-01T00:00:00Z`",
      optional: true,
    },
    includeText: {
      type: "string[]",
      label: "Include Text",
      description: "List of strings that must be present in the webpage text (max 5 words per string)",
      optional: true,
    },
    excludeText: {
      type: "string[]",
      label: "Exclude Text",
      description: "List of strings that must not be present in the webpage text",
      optional: true,
    },
    context: {
      type: "boolean",
      label: "Include Context",
      description: "Whether to include the context string in the search results",
      optional: true,
    },
    moderation: {
      type: "boolean",
      label: "Include Moderation",
      description: "Whether to include the moderation string in the search results",
      optional: true,
    },
    text: {
      type: "boolean",
      label: "Include Text",
      description: "Whether to include the full text of the search results",
      optional: true,
    },
    highlightsNumSentences: {
      type: "integer",
      label: "Highlights Num Sentences",
      description: "The number of sentences to return for each snippet.",
      optional: true,
    },
    highlightsPerUrl: {
      type: "integer",
      label: "Highlights Per URL",
      description: "The number of snippets to return for each result.",
      optional: true,
    },
    highlightsQuery: {
      type: "string",
      label: "Highlights Query",
      description: "Custom query to direct the LLM's selection of highlights.",
      optional: true,
    },
    summaryQuery: {
      type: "string",
      label: "Summary Query",
      description: "Custom query to guide summary generation",
      optional: true,
    },
    summarySchema: {
      type: "object",
      label: "Summary Schema",
      description: `JSON schema for structured output from summary. See [JSON Schema documentation](https://json-schema.org/overview/what-is-jsonschema) for details.

**Example:**
\`\`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Title",
  "type": "object",
  "properties": {
    "Property 1": {
      "type": "string",
      "description": "Description"
    },
    "Property 2": {
      "type": "string",
      "enum": ["option 1", "option 2", "option 3"],
      "description": "Description"
    }
  },
  "required": ["Property 1"]
}\`\``,
      optional: true,
    },
    livecrawl: {
      type: "string",
      label: "Live Crawl",
      description: "Control caching behavior for content retrieval",
      optional: true,
      options: [
        "never",
        "fallback",
        "always",
        "preferred",
      ],
    },
    livecrawlTimeout: {
      type: "integer",
      label: "Live Crawl Timeout",
      description: "Timeout in milliseconds for live crawling (default: 10000)",
      optional: true,
    },
    subpages: {
      type: "integer",
      label: "Subpages",
      description: "Number of subpages to crawl per result",
      optional: true,
    },
    subpageTarget: {
      type: "string",
      label: "Subpage Target",
      description: "Keywords to identify specific subpages to crawl",
      optional: true,
    },
    extrasLinks: {
      type: "integer",
      label: "Extras Links",
      description: "Number of URLs to return from each webpage.",
      optional: true,
    },
    extrasImageLinks: {
      type: "integer",
      label: "Extras Image Links",
      description: "Number of images to return for each result.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.exa.ai${path}`;
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._headers(),
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    search(args = {}) {
      return this.post({
        path: "/search",
        ...args,
      });
    },
    getContents(args = {}) {
      return this.post({
        path: "/contents",
        ...args,
      });
    },
    findSimilar(args = {}) {
      return this.post({
        path: "/findSimilar",
        ...args,
      });
    },
    answer(args = {}) {
      return this.post({
        path: "/answer",
        ...args,
      });
    },
  },
};
