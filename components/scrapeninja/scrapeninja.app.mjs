import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapeninja",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape.",
    },
    headers: {
      type: "string[]",
      label: "Headers",
      description: "Custom headers to send with the request. By default, regular Chrome browser headers are sent to the target URL.",
      optional: true,
    },
    retryNum: {
      type: "integer",
      label: "Retry Number",
      description: "Amount of attempts.",
      optional: true,
    },
    geo: {
      type: "string",
      label: "Geo",
      description: "Geo location for basic proxy pools (you can purchase premium ScrapeNinja proxies for wider country selection and higher proxy quality). [Read more about ScrapeNinja proxy setup](https://scrapeninja.net/docs/proxy-setup/)",
      optional: true,
    },
    proxy: {
      type: "string",
      label: "Proxy",
      description: "Premium or your own proxy URL (overrides `Geo` prop). [Read more about ScrapeNinja proxy setup](https://scrapeninja.net/docs/proxy-setup/).",
      optional: true,
    },
    followRedirects: {
      type: "integer",
      label: "Follow Redirects",
      description: "Whether to follow redirects.",
      optional: true,
      default: 1,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout per attempt, in seconds. Each retry will take [timeout] number of seconds.",
      min: 4,
      max: 30,
      optional: true,
    },
    textNotExpected: {
      type: "string[]",
      label: "Text Not Expected",
      description: "Text which will trigger a retry from another proxy address.",
      optional: true,
    },
    statusNotExpected: {
      type: "integer[]",
      label: "Status Not Expected",
      description: "HTTP response statuses which will trigger a retry from another proxy address.",
      optional: true,
    },
    extractor: {
      type: "string",
      label: "Extractor",
      description: "Custom JS function to extract JSON values from scraped HTML. Write&test your own extractor on [https://scrapeninja.net/cheerio-sandbox/](https://scrapeninja.net/cheerio-sandbox/)",
      optional: true,
    },
    waitForSelector: {
      type: "string",
      label: "Wait For Selector",
      description: "CSS selector to wait for before considering the page loaded.",
      optional: true,
    },
    postWaitTime: {
      type: "integer",
      label: "Post Wait Time",
      description: "Wait for specified amount of seconds after page load (from 1 to 12s). Use this only if ScrapeNinja failed to wait for required page elements automatically.",
      min: 1,
      max: 12,
      optional: true,
    },
    dumpIframe: {
      type: "string",
      label: "Dump Iframe",
      description: "If some particular iframe needs to be dumped, specify its name HTML value in this argument. The ScrapeNinja JS renderer will wait for CSS selector to wait for iframe DOM elements to appear inside.",
      optional: true,
    },
    waitForSelectorIframe: {
      type: "string",
      label: "Wait For Selector Iframe",
      description: "If `Dump Iframe` is activated, this property allows to wait for CSS selector inside this iframe.",
      optional: true,
    },
    extractorTargetIframe: {
      type: "boolean",
      label: "Extractor Target Iframe",
      description: "If `Dump Iframe` is activated, this property allows to run JS extractor function against iframe HTML instead of running it against base body. This is only useful if `Dump Iframe` is activated.",
      optional: true,
    },
    blockImages: {
      type: "boolean",
      label: "Block Images",
      description: "Block images from loading. This will speed up page loading and reduce bandwidth usage.",
      optional: true,
    },
    blockMedia: {
      type: "boolean",
      label: "Block Media",
      description: "Block (CSS, fonts) from loading. This will speed up page loading and reduce bandwidth usage.",
      optional: true,
    },
    screenshot: {
      type: "boolean",
      label: "Screenshot",
      description: "Take a screenshot of the page. Pass \"false\" to increase the speed of the request.",
      optional: true,
    },
    catchAjaxHeadersUrlMask: {
      type: "string",
      label: "Catch Ajax Headers URL Mask",
      description: "Useful to dump some XHR response. Pass URL mask here. For example, if you need to catch all requests to https://example.com/api/data.json, pass \"api/data.json\" here. In response, you will get new property `.info.catchedAjax` with the XHR response data - { url, method, headers[], body , status, responseHeaders{} }",
      optional: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Width of the viewport.",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Height of the viewport.",
      optional: true,
    },
    viewportDeviceScaleFactor: {
      type: "integer",
      label: "Viewport Device Scale Factor",
      description: "Device scale factor for the viewport.",
      optional: true,
    },
    viewportHasTouch: {
      type: "boolean",
      label: "Viewport Has Touch",
      description: "Whether the viewport has touch capabilities.",
      optional: true,
    },
    viewportIsMobile: {
      type: "boolean",
      label: "Viewport Is Mobile",
      description: "Whether the viewport is mobile.",
      optional: true,
    },
    viewportIsLandscape: {
      type: "boolean",
      label: "Viewport Is Landscape",
      description: "Whether the viewport is in landscape mode.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://scrapeninja.p.rapidapi.com";
    },
    _headers() {
      return {
        "content-type": "application/json",
        "X-RapidAPI-Key": this.$auth.rapid_api_key,
        "X-RapidAPI-Host": "scrapeninja.p.rapidapi.com",
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
    scrapeNonJs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrape",
        ...opts,
      });
    },
    scrapeJs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scrape-js",
        ...opts,
      });
    },
  },
};
