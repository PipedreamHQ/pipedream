import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "html_to_image",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage",
    },
    htmlContent: {
      type: "string",
      label: "HTML Content",
      description: "HTML Content to be used",
    },
    cssContent: {
      type: "string",
      label: "CSS Content",
      description: "CSS Content to be used",
      optional: true,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Quality of the image should be in the range 30-100. Default value is 30.",
      optional: true,
    },
    paperSize: {
      type: "string",
      label: "Paper Size",
      description: "Size of the paper",
      options: [
        "A3",
        "A4",
        "A5",
        "Letter",
        "Legal",
      ],
      optional: true,
    },
    landscape: {
      type: "boolean",
      label: "Landscape",
      description: "Page orientation where the content is formatted horizontally. By default the page orientation is Portrait",
      optional: true,
    },
    displayHeaderFooter: {
      type: "boolean",
      label: "Display Header Footer",
      description: "Generated PDF with have header and Footer on each page",
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background",
      description: "Prints any background colors or images used on the web page to the PDF. Its default value is `true`.",
      optional: true,
    },
    waitUntil: {
      type: "integer",
      label: "Wait Until",
      description: "  Number of seconds to wait before capturing a screenshot from the URL. Default value is 0",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.htmlcsstoimg.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "CLIENT-API-KEY": this.$auth.api_key,
        },
        ...opts,
      });
    },
    convertToImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generateImage",
        ...opts,
      });
    },
    convertToPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generatePdf",
        ...opts,
      });
    },
  },
};
