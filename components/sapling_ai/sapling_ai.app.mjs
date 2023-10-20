import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sapling_ai",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "Text to process for edits.",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Unique name or UUID of document or portion of text that is being checked.",
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Specifies language for grammar and spell checking.",
      options: Object.values(constants.LANGUAGE),
      optional: true,
    },
    autoApply: {
      type: "boolean",
      label: "Auto Apply",
      description: "Default is false. If true, result with have extra field applied_text containing text with edits applied.",
      optional: true,
    },
    medical: {
      type: "boolean",
      label: "Medical",
      description: "Default is false. If true, the backend will apply Sapling's medical dictionary. You can test the medical spellcheck system [here](https://sapling.ai/utilities/medical-spellcheck).",
      optional: true,
    },
    editId: {
      type: "string",
      label: "Edit ID",
      description: "Id of an Edit.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Text that should be autocompleted.",
    },
    completionId: {
      type: "string",
      label: "Completion ID",
      description: "ID of completion or hash returned from a **Request Completion**.",
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
    addApiKey(data) {
      if (!data) {
        return;
      }
      return {
        ...data,
        key: this.$auth.api_key,
      };
    },
    makeRequest({
      step = this, path, headers, url, params, data, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        params: this.addApiKey(params),
        data: this.addApiKey(data),
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
