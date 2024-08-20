import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firecrawl",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to start crawling from.",
    },
    crawlId: {
      type: "string",
      label: "Crawl ID",
      description: "Identifier of a certain crawl operation.",
    },
    includes: {
      type: "string[]",
      label: "Includes",
      description: "URL patterns to include.",
    },
    excludes: {
      type: "string[]",
      label: "Excludes",
      description: "URL patterns to exclude.",
    },
    generateImgAltText: {
      type: "boolean",
      label: "Generate Image Alt Text",
      description: "Generate alt text for images using LLMs (must have a paid plan).",
    },
    returnOnlyUrls: {
      type: "boolean",
      label: "Return Only URLs",
      description: "If true, returns only the URLs as a list on the crawl status. Attention: the return response will be a list of URLs inside the data, not a list of documents.",
    },
    maxDepth: {
      type: "string",
      label: "Max Depth",
      description: "Maximum depth to crawl relative to the entered URL. A maxDepth of 0 scrapes only the entered URL. A maxDepth of 1 scrapes the entered URL and all pages one level deep. A maxDepth of 2 scrapes the entered URL and all pages up to two levels deep. Higher values follow the same pattern.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The crawling mode to use. Fast mode crawls 4x faster websites without sitemap, but may not be as accurate and shouldn't be used in heavy js-rendered websites.",
      options: [
        "default",
        "fast",
      ],
    },
    ignoreSitemap: {
      type: "boolean",
      label: "Ignore Sitemap",
      description: "Ignore the website sitemap when crawling.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of pages to crawl.",
    },
    allowBackwardCrawling: {
      type: "boolean",
      label: "Allow Backward Crawling",
      description: "Enables the crawler to navigate from a specific URL to previously linked pages. For instance, from 'example.com/product/123' back to 'example.com/product'.",
    },
    allowExternalContentLinks: {
      type: "boolean",
      label: "Allow External Content Links",
      description: "Allows the crawler to follow links to external websites.",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Headers to send with the request. Can be used to send cookies, user-agent, etc..",
    },
    includeHtml: {
      type: "boolean",
      label: "Include HTML",
      description: "Include the HTML version of the content on page.",
    },
    includeRawHtml: {
      type: "boolean",
      label: "Include Raw HTML",
      description: "Include the raw HTML content of the page.",
    },
    onlyIncludeTags: {
      type: "string[]",
      label: "Only Include Tags",
      description: "Only include tags, classes, and ids from the page in the final output. Example: 'script, .ad, #footer'.",
    },
    onlyMainContent: {
      type: "boolean",
      label: "Only Main Content",
      description: "Only return the main content of the page excluding headers, navs, footers, etc..",
    },
    removeTags: {
      type: "string[]",
      label: "Remove Tags",
      description: "Tags, classes, and ids to remove from the page. Example: 'script, .ad, #footer'.",
    },
    replaceAllPathsWithAbsolutePaths: {
      type: "boolean",
      label: "Replace All Paths With Absolute Paths",
      description: "Replace all relative paths with absolute paths for images and links.",
    },
    screenshot: {
      type: "boolean",
      label: "Screenshot",
      description: "Include a screenshot of the top of the page that you are scraping.",
    },
    fullPageScreenshot: {
      type: "boolean",
      label: "Full Page Screenshot",
      description: "Include a full page screenshot of the page that you are scraping.",
    },
    waitFor: {
      type: "string",
      label: "Wait For",
      description: "Wait x amount of milliseconds for the page to load to fetch content.",
    },
    extractorMode: {
      type: "string",
      label: "Mode",
      description: "The extraction mode to use. 'markdown': Returns the scraped markdown content, does not perform LLM extraction. 'llm-extraction': Extracts information from the cleaned and parsed content using LLM. 'llm-extraction-from-raw-html': Extracts information directly from the raw HTML using LLM. 'llm-extraction-from-markdown': Extracts information from the markdown content using LLM.",
      options: [
        "markdown",
        "llm-extraction",
        "llm-extraction-from-raw-html",
        "llm-extraction-from-markdown",
      ],
    },
    extractionPrompt: {
      type: "string",
      label: "Extraction Prompt",
      description: "A prompt describing what information to extract from the page. LLM extraction modes.",
    },
    extractionSchema: {
      type: "object",
      label: "Extraction Schema",
      description: "The schema for the data to be extracted, required only for LLM extraction modes.",
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds for the request.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.firecrawl.dev/v0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    crawl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/crawl",
        ...opts,
      });
    },
    getCrawlStatus({
      crawlId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/crawl/status/${crawlId}`,
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
  },
};
