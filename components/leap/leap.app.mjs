import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "leap",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The identifier of a model",
      async options() {
        const models = await this.listModels();
        return models?.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        })) || [];
      },
    },
    subjectType: {
      type: "string",
      label: "Subject Type",
      description: "The subject type - what the underlying model is learning. Defaults to `Person` if left blank.",
      options: constants.SUBJECT_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tryleap.ai/api/v1/images";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    listImages({
      modelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/models/${modelId}/samples`,
        ...args,
      });
    },
    listModelVersions({
      modelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/models/${modelId}/versions`,
        ...args,
      });
    },
    createModel(args = {}) {
      return this._makeRequest({
        path: "/models",
        method: "POST",
        ...args,
      });
    },
    uploadImageSamples({
      modelId, ...args
    }) {
      return this._makeRequest({
        path: `/models/${modelId}/samples/url`,
        method: "POST",
        ...args,
      });
    },
    createImageGenerationJob({
      modelId, ...args
    }) {
      return this._makeRequest({
        path: `/models/${modelId}/inferences`,
        method: "POST",
        ...args,
      });
    },
  },
};
