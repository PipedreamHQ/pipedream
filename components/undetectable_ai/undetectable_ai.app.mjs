import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "undetectable_ai",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The document you want to humanize. Minimum 50 characters, maximum 15,000 characters",
    },
    readability: {
      type: "string",
      label: "Readability",
      description: "Readability of the humanized document",
      options: constants.READABILITY_OPTIONS,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Purpose of the humanized document",
      options: constants.PURPOSE_OPTIONS,
    },
    strength: {
      type: "string",
      label: "Strength",
      description: "Increases aggressiveness of humanization algorithms",
      optional: true,
      options: constants.STRENGTH_OPTIONS,
    },
    id: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document object submitted for humanization",
    },
    page: {
      type: "string",
      label: "Page",
      description: "The page number for pagination. Starts at 0. Each page contains upto 250 documents",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.undetectable.ai";
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
          "api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async submitDocument(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/submit",
        ...args,
      });
    },
    async retrieveDocument(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/document",
        ...args,
      });
    },
    async listDocuments(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/list",
        ...args,
      });
    },
  },
};
