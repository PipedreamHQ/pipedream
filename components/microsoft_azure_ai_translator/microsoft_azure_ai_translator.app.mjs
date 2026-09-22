import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "microsoft_azure_ai_translator",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "String that will be sent to the API",
    },
    to: {
      type: "string",
      label: "Output Language",
      description: "Language of the output text",
      async options() {
        const response = await this.getLanguages();
        return Object.entries(response.translation).map(([
          key,
          { name },
        ]) => ({
          label: name,
          value: key,
        }));
      },
    },
    from: {
      type: "string",
      label: "Input Language",
      description: "Language of the input text",
      optional: true,
      async options() {
        const response = await this.getLanguages();
        return Object.entries(response.translation).map(([
          key,
          { name },
        ]) => ({
          label: name,
          value: key,
        }));
      },
    },
    profanityAction: {
      type: "string",
      label: "Profanity Action",
      description: "Specifies how profanities should be treated",
      options: constants.PROFANITY_ACTIONS,
    },
    includeAlignment: {
      type: "boolean",
      label: "Include Alignment",
      description: "Specifies whether to include alignment projection from source text to translated text",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.endpoint}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      try {
        return await axios($, {
          ...otherOpts,
          url: this._baseUrl() + path,
          headers: {
            ...headers,
            "Ocp-Apim-Subscription-Key": `${this.$auth.api_key}`,
            "Ocp-Apim-Subscription-Region": `${this.$auth.location}`,
            "Content-Type": "application/json",
          },
          params: {
            ...params,
            "api-version": "3.0",
          },
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    async translateText(args = {}) {
      return this._makeRequest({
        path: "/translate",
        method: "post",
        ...args,
      });
    },
    async breakSentence(args = {}) {
      return this._makeRequest({
        path: "/breaksentence",
        method: "post",
        ...args,
      });
    },
    async detectLanguage(args = {}) {
      return this._makeRequest({
        path: "/detect",
        method: "post",
        ...args,
      });
    },
    async getLanguages(args = {}) {
      return this._makeRequest({
        path: "/languages",
        ...args,
      });
    },
  },
};
