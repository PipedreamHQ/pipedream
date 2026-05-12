import { axios } from "@pipedream/platform";

const SECTION_OPTIONS = [
  "header",
  "navigation",
  "banner",
  "body",
  "sidebar",
  "footer",
  "metadata",
];

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
      description: "Seed URL for the legacy Find Similar Links action. For new workflows, prefer deriving a Search query from the seed page. Example: `https://arxiv.org/abs/2307.06435`",
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "List of URLs to retrieve contents for",
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "List of Exa document IDs from previous Exa responses",
      optional: true,
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Number of search results to return. Exa currently supports up to 100 results for supported search types.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Search Type",
      description: "The type of search to perform. `auto` is recommended for most workflows.",
      optional: true,
      options: [
        "auto",
        "fast",
        "instant",
        "deep-lite",
        "deep",
        "deep-reasoning",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "A data category to focus on",
      optional: true,
      options: [
        "company",
        "people",
        "research paper",
        "news",
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
    moderation: {
      type: "boolean",
      label: "Include Moderation",
      description: "Whether to filter unsafe content from results",
      optional: true,
    },
    text: {
      type: "boolean",
      label: "Text",
      description: "Return full page text. Prefer Highlights when you want a smaller, more targeted context window.",
      optional: true,
    },
    highlights: {
      type: "boolean",
      label: "Highlights",
      description: "Return token-efficient highlights. This is the recommended default extraction mode for most Exa workflows.",
      optional: true,
    },
    highlightsMaxCharacters: {
      type: "integer",
      label: "Highlights Max Characters",
      description: "Optional cap on highlight characters per URL. Leave unset for Exa's highest-quality default.",
      optional: true,
    },
    highlightsQuery: {
      type: "string",
      label: "Highlights Query",
      description: "Optional query to guide which highlights Exa should return.",
      optional: true,
    },
    summary: {
      type: "boolean",
      label: "Summary",
      description: "Return Exa-generated summaries. Prefer Highlights unless you explicitly need Exa-side synthesis.",
      optional: true,
    },
    summaryQuery: {
      type: "string",
      label: "Summary Query",
      description: "Optional instructions that guide Exa's generated summary",
      optional: true,
    },
    summarySchema: {
      type: "object",
      label: "Summary Schema",
      description: `JSON schema for structured Exa summary output. See [JSON Schema documentation](https://json-schema.org/overview/what-is-jsonschema) for details.

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
    outputSchema: {
      type: "object",
      label: "Output Schema",
      description: "JSON schema for structured output from Exa. Use this to shape synthesized search or answer output.",
      optional: true,
    },
    systemPrompt: {
      type: "string",
      label: "System Prompt",
      description: "Instructions that guide Exa's synthesized output and, for deep search types, search planning.",
      optional: true,
    },
    additionalQueries: {
      type: "string[]",
      label: "Additional Queries",
      description: "Extra query variations for deep-lite, deep, or deep-reasoning search.",
      optional: true,
    },
    userLocation: {
      type: "string",
      label: "User Location",
      description: "Two-letter ISO country code used to bias results toward a region, for example `US`.",
      optional: true,
    },
    maxAgeHours: {
      type: "integer",
      label: "Max Age Hours",
      description: "Maximum acceptable age for cached content in hours. Use `0` to always live crawl, `-1` for cache only, or leave unset for Exa's default behavior.",
      optional: true,
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
      description: "Keyword or phrase Exa should prioritize when choosing which subpages to crawl",
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
    textMaxCharacters: {
      type: "integer",
      label: "Text Max Characters",
      description: "Optional cap on returned text length.",
      optional: true,
    },
    textIncludeHtmlTags: {
      type: "boolean",
      label: "Text Include HTML Tags",
      description: "Whether to preserve HTML tags in extracted text.",
      optional: true,
    },
    textVerbosity: {
      type: "string",
      label: "Text Verbosity",
      description: "Level of detail for extracted text. Exa recommends using `Max Age Hours` of `0` when you need filtered live text.",
      optional: true,
      options: [
        "compact",
        "standard",
        "full",
      ],
    },
    textIncludeSections: {
      type: "string[]",
      label: "Text Include Sections",
      description: "Only include these page sections. Most reliable with `Max Age Hours` set to `0`.",
      optional: true,
      options: SECTION_OPTIONS,
    },
    textExcludeSections: {
      type: "string[]",
      label: "Text Exclude Sections",
      description: "Exclude these page sections. Most reliable with `Max Age Hours` set to `0`.",
      optional: true,
      options: SECTION_OPTIONS,
    },
    excludeSourceDomain: {
      type: "boolean",
      label: "Exclude Source Domain",
      description: "Exclude the seed URL's domain from Find Similar results.",
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
        "x-exa-integration": "PipedreamHQ/pipedream",
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
