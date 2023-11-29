import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "zest",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The identifier of the campaign to create the gift within",
    },
  },
  methods: {
    getApiKey() {
      return this.$auth.api_key;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-api-key": this.getApiKey(),
      };
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _makeRequest({
      $ = this, path, headers, data, ...args
    }) {
      const {
        getHeaders,
        getUrl,
      } = this;

      const config = {
        ...args,
        url: getUrl(path),
        data: utils.filterProps(data),
        headers: getHeaders(headers),
      };

      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
  },
};
