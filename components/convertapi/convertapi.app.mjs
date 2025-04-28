import { axios } from "@pipedream/platform";
import { FORMAT_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "convertapi",
  propDefinitions: {
    base64String: {
      type: "string",
      label: "Base64 String",
      description: "The base64 string of the file to convert",
    },
    formatFrom: {
      type: "string",
      label: "Input Format",
      description: "The format of the input file.",
      options: FORMAT_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://v2.convertapi.com";
    },
    _params(params = {}) {
      return {
        Secret: `${this.$auth.api_secret}`,
        ...params,
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
    getAllowedFormats({ formatFrom }) {
      return this._makeRequest({
        path: `/info/openapi/${formatFrom}/to/*`,
      });
    },
    convertFileToFormat({
      formatFrom, formatTo, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/convert/${formatFrom}/to/${formatTo}`,
        ...opts,
      });
    },
    convertWebToFormat({
      formatTo, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/convert/web/to/${formatTo}`,
        ...opts,
      });
    },
  },
};
