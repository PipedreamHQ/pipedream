import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "convertapi",
  propDefinitions: {
    base64String: {
      type: "string",
      label: "Base64 String",
      description: "The base64 string of the file to convert",
    },
    format: {
      type: "string",
      label: "Output Format",
      description: "The desired output format for the converted file.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to be converted. Provide a URL or file content.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The website URL to be converted to a specified format.",
    },
    userJs: {
      type: "string",
      label: "User JavaScript",
      description: "Execute provided JavaScript before conversion begins.",
      optional: true,
    },
    userCss: {
      type: "string",
      label: "User CSS",
      description: "Apply additional CSS before conversion begins.",
      optional: true,
    },
    hideElements: {
      type: "string",
      label: "Hide Elements",
      description: "Element selector string of the DOM elements that need to be hidden during conversion.",
      optional: true,
    },
    cssMediaType: {
      type: "string",
      label: "CSS Media Type",
      description: "Use CSS media type in conversion process.",
      optional: true,
      default: "screen",
    },
    headers: {
      type: "string",
      label: "Headers",
      description: "Headers to include in the conversion request.",
      optional: true,
    },
    loadLazyContent: {
      type: "boolean",
      label: "Load Lazy Content",
      description: "Load page images that load only when they are visible.",
      optional: true,
      default: false,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Sets browser viewport width.",
      optional: true,
      min: 200,
      max: 4000,
      default: 1366,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Sets browser viewport height.",
      optional: true,
      min: 200,
      max: 4000,
      default: 1024,
    },
    respectViewport: {
      type: "boolean",
      label: "Respect Viewport",
      description: "If true, the converter will generate PDF as the content looks like in the browser.",
      optional: true,
      default: true,
    },
    scale: {
      type: "integer",
      label: "Scale",
      description: "Set web page scale value in percentage.",
      optional: true,
      min: 10,
      max: 200,
      default: 100,
    },
    pageOrientation: {
      type: "string",
      label: "Page Orientation",
      description: "PDF page orientation.",
      optional: true,
      default: "portrait",
      enum: [
        "portrait",
        "landscape",
      ],
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "PDF page size.",
      optional: true,
      default: "letter",
      enum: [
        "a0",
        "a1",
        "a2",
        "a3",
        "a4",
        "a5",
        "a6",
        "a7",
        "a8",
        "a9",
        "b0",
        "b1",
        "b2",
        "b3",
        "b4",
        "b5",
        "letter",
        "legal",
        "ledger",
      ],
    },
    marginTop: {
      type: "integer",
      label: "Margin Top",
      description: "Set the page top margin in mm.",
      optional: true,
      min: 0,
      max: 500,
      default: 10,
    },
    marginRight: {
      type: "integer",
      label: "Margin Right",
      description: "Set the page right margin in mm.",
      optional: true,
      min: 0,
      max: 500,
      default: 10,
    },
    marginBottom: {
      type: "integer",
      label: "Margin Bottom",
      description: "Set the page bottom margin in mm.",
      optional: true,
      min: 0,
      max: 500,
      default: 10,
    },
    marginLeft: {
      type: "integer",
      label: "Margin Left",
      description: "Set the page left margin in mm.",
      optional: true,
      min: 0,
      max: 500,
      default: 10,
    },
    pageRange: {
      type: "string",
      label: "Page Range",
      description: "Set page range. Example 1-10 or 1,2,5.",
      optional: true,
      default: "1-100",
    },
  },
  methods: {
    _baseUrl() {
      return "https://v2.convertapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
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
    async convertBase64ToFormat(opts = {}) {
      const {
        base64String, format, ...rest
      } = opts;
      return this._makeRequest({
        path: format
          ? `/convert/base64/to/${format}`
          : "/convert/base64/to",
        data: {
          base64_string: base64String,
          ...rest,
        },
      });
    },
    async convertFileToFormat(opts = {}) {
      const {
        file, format, ...rest
      } = opts;
      return this._makeRequest({
        path: format
          ? `/convert/file/to/${format}`
          : "/convert/file/to",
        data: {
          file,
          ...rest,
        },
      });
    },
    async convertUrlToFormat(opts = {}) {
      const {
        url, format, ...rest
      } = opts;
      return this._makeRequest({
        path: format
          ? `/convert/url/to/${format}`
          : "/convert/url/to",
        data: {
          url,
          ...rest,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
