import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import LANG from "./common/language.mjs";

export default {
  type: "app",
  app: "textcortex",
  propDefinitions: {
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens to generate.",
      optional: true,
      default: 512,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The language model to use. Allowed values: `velox-1`, `aecus-1`, `alta-1`, `sophos-1` and `chat-sophos-1`",
      options: Object.values(constants.MODEL),
      default: constants.MODEL.CHATSOPHOS1,
      optional: true,
    },
    n: {
      type: "integer",
      label: "N",
      description: "The number of outputs to generate.",
      default: 1,
      optional: true,
    },
    sourceLang: {
      type: "string",
      label: "Source Language",
      description: "The language of the source text.",
      options: Object.values(LANG),
      default: LANG.EN.value,
      optional: true,
    },
    targetLang: {
      type: "string",
      label: "Target Language",
      description: "The language which the text should be generated in.",
      options: Object.values(LANG),
      default: LANG.EN.value,
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to translate.",
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The sampling temperature to be used in text generation. The higher the temperature, the higher the risk of the output to sound \"made up\".",
      default: "0.7",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
