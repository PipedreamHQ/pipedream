import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_munk",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.pdfmunk.com/api";
    },
    _getHeaders() {
      return {
        "accept": "application/json",
        "client-api-key": `${this.$auth.api_key}`,
        "content-type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      method = "POST",
      path,
      data,
      ...opts
    }) {
      const {
        headers: userHeaders,
        ...rest
      } = opts;
      const config = {
        method,
        ...rest,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._getHeaders(),
          ...(userHeaders || {}),
        },
        data,
      };
      return await axios($, config);
    },
    async captureWebsiteScreenshot({
      $,
      url,
    }) {
      const data = await this._makeRequest({
        $,
        method: "POST",
        path: "/v1/generateImage",
        data: {
          url,
        },
      });
      return data;
    },
    async captureWebsiteToPdf({
      $,
      url,
      paper_size,
      landscape,
      displayHeaderFooter,
      page_size,
      printBackground,
    }) {
      const data = await this._makeRequest({
        $,
        method: "POST",
        path: "/v1/generatePdf",
        data: {
          url,
          paper_size,
          landscape,
          displayHeaderFooter,
          page_size,
          printBackground,
        },
      });
      return data;
    },
    async convertHtmlToImage({
      $,
      html_content,
      css_content,
      width,
      height,
    }) {
      const data = await this._makeRequest({
        $,
        method: "POST",
        path: "/v1/generateImage",
        data: {
          html_content,
          css_content,
          width,
          height,
        },
      });
      return data;
    },
    async convertHtmlToPdf({
      $,
      html_content,
      css_content,
      paper_size,
      page_size,
    }) {
      const data = await this._makeRequest({
        $,
        method: "POST",
        path: "/v1/generatePdf",
        data: {
          html_content,
          css_content,
          paper_size,
          page_size,
        },
      });
      return data;
    },
  },
};
