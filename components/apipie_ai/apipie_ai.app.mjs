import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "apipie_ai",
  propDefinitions: {
    modelType: {
      type: "string",
      label: "Model Type",
      description: "Filter by type of model.",
      options: Object.values(constants.MODEL_TYPE_OPTION),
    },
    modelSubtype: {
      type: "string",
      label: "Model Subtype",
      description: "Filter by subtype of model.",
      optional: true,
      options: Object.values(constants.MODEL_SUBTYPE_OPTION),
    },
    model: {
      type: "string",
      label: "Model",
      description: "Language Model to use, comma separated, up to 5 models.",
      async options({
        params,
        mapper = (record) => record.model ?? record.name,
        filter = () => true,
      }) {
        const { data } = await this.fetchModels({
          params,
        });
        return data.filter(filter).map(mapper);
      },
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "Name of the provider, default to `openai`.",
      default: "openai",
      options: [
        "openai",
        "openrouter",
        "bedrock",
        "monster",
        "edenai",
        "together",
        "deepinfra",
        "elevenlabs",
        "prodia",
        "anthropic",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    fetchModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
  },
};
