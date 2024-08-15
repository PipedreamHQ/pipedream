import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firecrawl",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to start crawling or scraping from",
    },
    crawlId: {
      type: "string",
      label: "Crawl ID",
      description: "Identifier of a certain crawl operation",
    },
    crawlerOptions: {
      type: "object",
      label: "Crawler Options",
      description: "Options for configuring the crawler",
      optional: true,
      properties: {
        includes: {
          type: "string[]",
          label: "Includes",
          description: "URL patterns to include",
          optional: true,
        },
        excludes: {
          type: "string[]",
          label: "Excludes",
          description: "URL patterns to exclude",
          optional: true,
        },
        generateImgAltText: {
          type: "boolean",
          label: "Generate Image Alt Text",
          description: "Generate alt text for images using LLMs (must have a paid plan)",
          optional: true,
        },
        returnOnlyUrls: {
          type: "boolean",
          label: "Return Only URLs",
          description: "If true, returns only the URLs as a list on the crawl status",
          optional: true,
        },
        maxDepth: {
          type: "integer",
          label: "Max Depth",
          description: "Maximum depth to crawl relative to the entered URL",
          optional: true,
        },
        mode: {
          type: "string",
          label: "Mode",
          description: "The crawling mode to use",
          options: [
            "default",
            "fast",
          ],
          optional: true,
        },
        ignoreSitemap: {
          type: "boolean",
          label: "Ignore Sitemap",
          description: "Ignore the website sitemap when crawling",
          optional: true,
        },
        limit: {
          type: "integer",
          label: "Limit",
          description: "Maximum number of pages to crawl",
          optional: true,
        },
        allowBackwardCrawling: {
          type: "boolean",
          label: "Allow Backward Crawling",
          description: "Enables the crawler to navigate from a specific URL to previously linked pages",
          optional: true,
        },
        allowExternalContentLinks: {
          type: "boolean",
          label: "Allow External Content Links",
          description: "Allows the crawler to follow links to external websites",
          optional: true,
        },
      },
    },
    pageOptions: {
      type: "object",
      label: "Page Options",
      description: "Options for configuring the page scraping",
      optional: true,
      properties: {
        headers: {
          type: "object",
          label: "Headers",
          description: "Headers to send with the request. Can be used to send cookies, user-agent, etc.",
          optional: true,
        },
        includeHtml: {
          type: "boolean",
          label: "Include HTML",
          description: "Include the HTML version of the content on page",
          optional: true,
        },
        includeRawHtml: {
          type: "boolean",
          label: "Include Raw HTML",
          description: "Include the raw HTML content of the page",
          optional: true,
        },
        onlyIncludeTags: {
          type: "string[]",
          label: "Only Include Tags",
          description: "Only include tags, classes, and ids from the page in the final output",
          optional: true,
        },
        onlyMainContent: {
          type: "boolean",
          label: "Only Main Content",
          description: "Only return the main content of the page excluding headers, navs, footers, etc.",
          optional: true,
        },
        removeTags: {
          type: "string[]",
          label: "Remove Tags",
          description: "Tags, classes, and ids to remove from the page",
          optional: true,
        },
        replaceAllPathsWithAbsolutePaths: {
          type: "boolean",
          label: "Replace All Paths With Absolute Paths",
          description: "Replace all relative paths with absolute paths for images and links",
          optional: true,
        },
        screenshot: {
          type: "boolean",
          label: "Screenshot",
          description: "Include a screenshot of the top of the page that you are scraping",
          optional: true,
        },
        fullPageScreenshot: {
          type: "boolean",
          label: "Full Page Screenshot",
          description: "Include a full page screenshot of the page that you are scraping",
          optional: true,
        },
        waitFor: {
          type: "integer",
          label: "Wait For",
          description: "Wait x amount of milliseconds for the page to load to fetch content",
          optional: true,
        },
      },
    },
    extractorOptions: {
      type: "object",
      label: "Extractor Options",
      description: "Options for extraction of structured information from the page content",
      optional: true,
      properties: {
        mode: {
          type: "string",
          label: "Mode",
          description: "The extraction mode to use",
          options: [
            "markdown",
            "llm-extraction",
            "llm-extraction-from-raw-html",
            "llm-extraction-from-markdown",
          ],
          optional: true,
        },
        extractionPrompt: {
          type: "string",
          label: "Extraction Prompt",
          description: "A prompt describing what information to extract from the page",
          optional: true,
        },
        extractionSchema: {
          type: "object",
          label: "Extraction Schema",
          description: "The schema for the data to be extracted, required only for LLM extraction modes",
          optional: true,
        },
      },
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds for the request",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.firecrawl.dev";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async crawl(opts = {}) {
      const {
        url, crawlerOptions, pageOptions,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v0/crawl",
        data: {
          url,
          crawlerOptions,
          pageOptions,
        },
      });
    },
    async getCrawlStatus(opts = {}) {
      const { crawlId } = opts;
      return this._makeRequest({
        method: "GET",
        path: `/v0/crawl/status/${crawlId}`,
      });
    },
    async scrape(opts = {}) {
      const {
        url, pageOptions, extractorOptions, timeout,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v0/scrape",
        data: {
          url,
          pageOptions,
          extractorOptions,
          timeout,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
