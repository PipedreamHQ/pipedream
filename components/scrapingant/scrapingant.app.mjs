import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "scrapingant",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape",
    },
    browser: {
      type: "boolean",
      label: "Browser",
      description: "Enables using a headless browser for scraping",
      optional: true,
    },
    returnPageSource: {
      type: "boolean",
      label: "Return Page Source",
      description: "Enables returning data returned by the server and unaltered by the browser. When true JS won't be rendered",
      optional: true,
    },
    cookies: {
      type: "string",
      label: "Cookies",
      description: "Cookies to pass with a scraping request to the target site, i.e.: `cookie_name1=cookie_value1;cookie_name2=cookie_value2`",
      optional: true,
    },
    jsSnippet: {
      type: "string",
      label: "JS Snippet",
      description: "Base64 encoded JS snippet to run once page being loaded in the ScrapingAnt browser",
      optional: true,
    },
    proxyType: {
      type: "string",
      label: "Proxy Type",
      description: "Specifies the proxy type to make the request from",
      options: constants.PROXY_TYPES,
      optional: true,
    },
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "Specifies the proxy country to make the request from",
      options: constants.PROXY_COUNTRIES,
      optional: true,
    },
    waitForSelector: {
      type: "string",
      label: "Wait for Selector",
      description: "The CSS selector of the element Scrapingant will wait for before returning the result",
      optional: true,
    },
    blockResource: {
      type: "string[]",
      label: "Block Resource",
      description: "Prevents cloud browser from loading specified resource types",
      options: constants.RESOURCE_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapingant.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_token}`,
        },
      });
    },
    async generalExtraction(args = {}) {
      return this._makeRequest({
        path: "/general",
        ...args,
      });
    },
  },
};
