import { axios } from "@pipedream/platform";
import { CONTENT_TYPE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "scrapfly",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "This URL is used to transform any relative URLs in the document into absolute URLs automatically. It can be either the base URL or the exact URL of the document. [Must be url encoded](https://scrapfly.io/web-scraping-tools/urlencode).",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The request body must contain the content of the page you want to extract data from. The content must be in the format specified by the `content-type` header or via the `content_type` HTTP parameter.  Provide a file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Content type of the document pass in the body - You must specify the content type of the document by using this parameter or via the `content-type` header. This parameter has priority over the `content-type` header.",
      options: CONTENT_TYPE_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapfly.io";
    },
    _params(params = {}) {
      return {
        ...params,
        key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, params, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    getAccountInfo(opts = {}) {
      return this._makeRequest({
        path: "/account",
        ...opts,
      });
    },
    extractWebPageContent({
      params, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/scrape",
        params,
        ...opts,
      });
    },
    automateContentExtraction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/extraction",
        ...opts,
      });
    },
  },
};
