import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "llmwhisperer",
  propDefinitions: {
    whisperHash: {
      type: "string",
      label: "Whisper Hash",
      description: "The whisper hash returned while starting the whisper process.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "unstract-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
