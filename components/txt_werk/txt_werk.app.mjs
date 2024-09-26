import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "txt_werk",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "Text to be analyzed",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the document to be analyzed",
      optional: true,
    },
    services: {
      type: "string[]",
      label: "Services",
      description: "List of services to request",
      options: constants.SERVICES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.txtwerk.de/rest/txt";
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
          "X-Api-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async analyzeText(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/analyzer",
        ...args,
      });
    },
  },
};
