import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ecologi",
  propDefinitions: {
    number: {
      type: "integer",
      label: "number",
      description: "Number of trees of offsets to purchase",
    },
    name: {
      type: "string",
      label: "name",
      description: "The 'funded by' name for the trees",
      optional: true,
    },
    units: {
      type: "string",
      label: "units",
      description: "The unit of the amount of offsets to purchase",
      options: constants.UNIT_TYPES,
    },
    test: {
      type: "boolean",
      label: "test",
      description: "Whether this is a test transaction or not",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://public.ecologi.com";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          ...headers,
        },
      });
    },

    async buyTrees(args = {}) {
      return this._makeRequest({
        path: "/impact/trees",
        method: "post",
        ...args,
      });
    },
    async buyOffsets(args = {}) {
      return this._makeRequest({
        path: "/impact/carbon",
        method: "post",
        ...args,
      });
    },
  },
};
