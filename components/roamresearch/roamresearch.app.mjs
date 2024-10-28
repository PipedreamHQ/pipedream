import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "roamresearch",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The content of the block to be added.",
    },
    nestUnder: {
      type: "string",
      label: "Nest Under",
      description: "Title of the block to nest the new block under.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, api = constants.API.DEFAULT) {
      const { graph_name: graphName } = this.$auth;
      const baseUrl = constants.BASE_URL.replace(constants.SUBDOMAIN_PLACEHOLDER, api);
      return `${baseUrl}${constants.VERSION_PATH}/${graphName}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, api, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, api),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    appendBlocks(args = {}) {
      return this.post({
        api: constants.API.APPEND,
        path: "/append-blocks",
        ...args,
      });
    },
    query(args = {}) {
      return this.post({
        path: "/q",
        ...args,
      });
    },
    pull(args = {}) {
      return this.post({
        path: "/pull",
        ...args,
      });
    },
  },
};
