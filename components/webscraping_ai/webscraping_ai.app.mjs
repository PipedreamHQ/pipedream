import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscraping_ai",
  version: "0.0.{{ts}}",
  propDefinitions: {
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL of the webpage to scrape.",
    },
    selectors: {
      type: "string[]",
      label: "Selectors",
      description: "Optional CSS selectors to target specific elements on the page.",
      optional: true,
    },
    renderingMode: {
      type: "string",
      label: "Rendering Mode",
      description: "The mode to render the page (e.g., 'light', 'dark').",
      optional: true,
    },
    headers: {
      type: "string[]",
      label: "Headers",
      description: "Optional HTTP headers to include in the request, as JSON strings.",
      optional: true,
    },
    textFormat: {
      type: "string",
      label: "Text Format",
      description: "The format of the returned text content (e.g., 'plain', 'html').",
      optional: true,
    },
    returnLinks: {
      type: "boolean",
      label: "Return Links",
      description: "Whether to include links in the returned text content.",
      optional: true,
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask about the given webpage.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.webscraping.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    async startScrapingJob() {
      const data = {
        url: this.targetUrl,
      };
      if (this.selectors) data.selectors = this.selectors;
      if (this.renderingMode) data.rendering_mode = this.renderingMode;
      if (this.headers) {
        data.headers = this.headers.reduce((acc, headerStr) => {
          try {
            const header = JSON.parse(headerStr);
            return {
              ...acc,
              ...header,
            };
          } catch (e) {
            return acc;
          }
        }, {});
      }
      return this._makeRequest({
        method: "POST",
        path: "/scraping-jobs",
        data,
      });
    },
    async getVisibleTextContent() {
      const params = {
        url: this.targetUrl,
      };
      if (this.textFormat) params.text_format = this.textFormat;
      if (this.returnLinks !== undefined) params.return_links = this.returnLinks;
      return this._makeRequest({
        method: "GET",
        path: "/text-content",
        params,
      });
    },
    async getAnswerToQuestion() {
      const data = {
        url: this.targetUrl,
        question: this.question,
      };
      return this._makeRequest({
        method: "POST",
        path: "/answer",
        data,
      });
    },
  },
};
