import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "capturekit",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Target webpage to capture",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The output format of the screenshot",
      optional: true,
      options: [
        "webp",
        "jpeg",
        "jpg",
        "png",
        "pdf",
      ],
    },
    device: {
      type: "string",
      label: "Device",
      description: "Device type used for emulation (desktop or mobile)",
      optional: true,
      options: [
        "iphone_14_pro_max",
        "iphone_14_pro",
        "iphone_13_pro_max",
        "iphone_13_mini",
        "galaxy_s23_ultra",
        "galaxy_s23",
        "galaxy_fold4",
        "pixel_7_pro",
        "pixel_6a",
        "redmi_note_12_pro",
        "redmi_note_11",
        "huawei_p60_pro",
        "huawei_mate_50_pro",
        "iphone_x",
        "iphone_12",
        "pixel_5",
        "galaxy_s8",
        "ipad",
      ],
    },
    cache: {
      type: "boolean",
      label: "Cache",
      description: "Enable or disable response caching",
      optional: true,
    },
    fullPageScroll: {
      type: "boolean",
      label: "Full Page Scroll",
      description: "Scroll through the entire page before capturing",
      optional: true,
    },
    includeHtml: {
      type: "boolean",
      label: "Include HTML",
      description: "Return the raw HTML content in the response",
      optional: true,
    },
    useDefuddle: {
      type: "boolean",
      label: "Use Defuddle",
      description: "Use Defuddle to clean and extract the main content from web pages",
      optional: true,
    },
    selector: {
      type: "string",
      label: "Selector",
      description: "Capture a specific element on the page instead of the full viewport",
      optional: true,
    },
    removeSelectors: {
      type: "string[]",
      label: "Remove Selectors",
      description: "A list of elements to hide before capturing",
      optional: true,
    },
    blockUrls: {
      type: "string[]",
      label: "Block URLs",
      description: "A ist of URL patterns to block. You can specify URLs, domains, or simple patterns, e.g.: `.example.com/`",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name of the screenshot file that will be saved on /tmp",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.capturekit.dev";
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
          "x-access-key": `${this.$auth.access_key}`,
          ...headers,
        },
      });
    },

    async captureScreenshot(args = {}) {
      return this._makeRequest({
        path: "/capture",
        ...args,
      });
    },

    async scrapeContent(args = {}) {
      return this._makeRequest({
        path: "/content",
        ...args,
      });
    },
  },
};
