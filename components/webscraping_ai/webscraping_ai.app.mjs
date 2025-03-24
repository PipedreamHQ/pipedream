import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscraping_ai",
  propDefinitions: {
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL of the webpage to scrape.",
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "HTTP headers to pass to the target page",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Maximum web page retrieval time in ms. Increase it in case of timeout errors (10000 by default, maximum is 30000).",
      optional: true,
    },
    js: {
      type: "boolean",
      label: "JS",
      description: "Execute on-page JavaScript using a headless browser (`true` by default)",
      optional: true,
    },
    jsTimeout: {
      type: "integer",
      label: "JS Timeout",
      description: "Maximum JavaScript rendering time in ms. Default: `2000`",
      optional: true,
    },
    waitFor: {
      type: "string",
      label: "Wait For",
      description: "CSS selector to wait for before returning the page content. Useful for pages with dynamic content loading. Overrides js_timeout.",
      optional: true,
    },
    proxy: {
      type: "string",
      label: "Proxy",
      description: "Type of proxy, use residential proxies if your site restricts traffic from datacenters (`datacenter` by default). Note that residential proxy requests are more expensive than datacenter, see the pricing page for details.",
      options: [
        "datacenter",
        "residential",
      ],
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the proxy to use (`us` by default)",
      options: [
        "us",
        "gb",
        "de",
        "it",
        "fr",
        "ca",
        "es",
        "ru",
        "jp",
        "kr",
        "in",
      ],
      optional: true,
    },
    customProxy: {
      type: "string",
      label: "Custom Proxy",
      description: "Your own proxy URL to use instead of our built-in proxy pool in \"http://user:password@host:port\" format ([Smartproxy](https://webscraping.ai/proxies/smartproxy) for example).",
      optional: true,
    },
    device: {
      type: "string",
      label: "Device",
      description: "Type of device emulation. Default is `desktop`",
      options: [
        "desktop",
        "mobile",
        "tablet",
      ],
      optional: true,
    },
    errorOn404: {
      type: "boolean",
      label: "Error on 404",
      description: "Return error on 404 HTTP status on the target page (`false` by default)",
      optional: true,
    },
    errorOnRedirect: {
      type: "boolean",
      label: "Error on Redirect",
      description: "Return error on redirect on the target page (`false` by default)",
      optional: true,
    },
    jsScript: {
      type: "string",
      label: "JS Script",
      description: "Custom JavaScript code to execute on the target page. Example: `document.querySelector('button').click();`",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format of the response (`text` by default). `json` will return a JSON object with the response, `text` will return a plain text/HTML response.",
      options: [
        "json",
        "text",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.webscraping.ai";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    pageHtmlByUrl(opts = {}) {
      return this._makeRequest({
        path: "/html",
        ...opts,
      });
    },
    pageTextByUrl(opts = {}) {
      return this._makeRequest({
        path: "/text",
        ...opts,
      });
    },
    getAnswerToQuestion(opts = {}) {
      return this._makeRequest({
        path: "/ai/question",
        ...opts,
      });
    },
  },
};
