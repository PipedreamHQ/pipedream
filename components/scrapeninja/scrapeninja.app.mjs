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
      description: "Custom headers to send with the request.",
      optional: true,
    },
    retrynum: {
      type: "integer",
      label: "Retry Number",
      description: "Number of retry attempts.",
      optional: true,
    },
    geo: {
      type: "string",
      label: "Geo",
      description: "Geo location for proxy pools (default: us).",
      optional: true,
      default: "us",
    },
    proxy: {
      type: "string",
      label: "Proxy",
      description: "Premium or custom proxy URL.",
      optional: true,
    },
    followredirects: {
      type: "integer",
      label: "Follow Redirects",
      description: "Whether to follow redirects (default: 1).",
      optional: true,
      default: 1,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout per attempt in seconds.",
      optional: true,
    },
    textnotexpected: {
      type: "string[]",
      label: "Text Not Expected",
      description: "Text that triggers a retry from another proxy.",
      optional: true,
    },
    statusnotexpected: {
      type: "integer[]",
      label: "Status Not Expected",
      description: "HTTP statuses that trigger a retry from another proxy (default: [403, 502]).",
      optional: true,
      default: [
        403,
        502,
      ],
    },
    extractor: {
      type: "string",
      label: "Extractor",
      description: "Custom JS function to extract JSON values from scraped HTML.",
      optional: true,
    },
    waitforselector: {
      type: "string",
      label: "Wait For Selector",
      description: "CSS selector to wait for before considering the page loaded.",
      optional: true,
    },
    postwaittime: {
      type: "integer",
      label: "Post Wait Time",
      description: "Time to wait after page load in seconds.",
      optional: true,
    },
    dumpiframe: {
      type: "string",
      label: "Dump Iframe",
      description: "Name of the iframe to dump.",
      optional: true,
    },
    waitforselectoriframe: {
      type: "string",
      label: "Wait For Selector Iframe",
      description: "CSS selector to wait for inside the iframe.",
      optional: true,
    },
    extractortargetiframe: {
      type: "boolean",
      label: "Extractor Target Iframe",
      description: "Run extractor function against iframe HTML.",
      optional: true,
    },
    blockimages: {
      type: "boolean",
      label: "Block Images",
      description: "Block images from loading to speed up the request.",
      optional: true,
    },
    blockmedia: {
      type: "boolean",
      label: "Block Media",
      description: "Block media resources like CSS and fonts from loading.",
      optional: true,
    },
    screenshot: {
      type: "boolean",
      label: "Screenshot",
      description: "Take a screenshot of the page.",
      optional: true,
    },
    catchajaxheadersurlmask: {
      type: "string",
      label: "Catch Ajax Headers URL Mask",
      description: "URL mask to catch specific AJAX responses.",
      optional: true,
    },
    viewportwitdh: {
      type: "integer",
      label: "Viewport Width",
      description: "Width of the viewport.",
      optional: true,
    },
    viewportheight: {
      type: "integer",
      label: "Viewport Height",
      description: "Height of the viewport.",
      optional: true,
    },
    viewportdevicescalefactor: {
      type: "integer",
      label: "Viewport Device Scale Factor",
      description: "Device scale factor for the viewport.",
      optional: true,
    },
    viewporthastouch: {
      type: "boolean",
      label: "Viewport Has Touch",
      description: "Whether the viewport has touch capabilities.",
      optional: true,
    },
    viewportismobile: {
      type: "boolean",
      label: "Viewport Is Mobile",
      description: "Whether the viewport is mobile.",
      optional: true,
    },
    viewportislandscape: {
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-RapidAPI-Key": this.$auth.api_key,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        ...otherOpts,
      });
    },
    async scrapeNonJs(opts = {}) {
      const data = {
        url: this.url,
        headers: this.headers,
        retryNum: this.retrynum,
        geo: this.geo,
        proxy: this.proxy,
        followRedirects: this.followredirects,
        timeout: this.timeout,
        textNotExpected: this.textnotexpected,
        statusNotExpected: this.statusnotexpected,
        extractor: this.extractor,
      };
      return this._makeRequest({
        path: "/scrape",
        data,
      });
    },
    async scrapeJs(opts = {}) {
      const viewport = {
        width: this.viewportwitdh,
        height: this.viewportheight,
        deviceScaleFactor: this.viewportdevicescalefactor,
        hasTouch: this.viewporthastouch,
        isMobile: this.viewportismobile,
        isLandscape: this.viewportislandscape,
      };
      const data = {
        url: this.url,
        waitForSelector: this.waitforselector,
        postWaitTime: this.postwaittime,
        dumpIframe: this.dumpiframe,
        waitForSelectorIframe: this.waitforselectoriframe,
        extractorTargetIframe: this.extractortargetiframe,
        headers: this.headers,
        retryNum: this.retrynum,
        geo: this.geo,
        proxy: this.proxy,
        timeout: this.timeout,
        textNotExpected: this.textnotexpected,
        statusNotExpected: this.statusnotexpected,
        blockImages: this.blockimages,
        blockMedia: this.blockmedia,
        screenshot: this.screenshot,
        catchAjaxHeadersUrlMask: this.catchajaxheadersurlmask,
        viewport,
        extractor: this.extractor,
      };
      return this._makeRequest({
        path: "/scrape-js",
        data,
      });
    },
  },
  version: "0.0.{{ts}}",
};
