import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "replicate",
  propDefinitions: {
    collectionSlug: {
      type: "string",
      label: "Collection Id",
      description: "The ID of the collection that you want to use.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listCollections({
          params: {
            cursor: prevContext.cursor,
          },
        });
        const cursor = next && next.split("cursor=");
        return {
          options: results.map(({
            slug: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: cursor
              ? cursor[1]
              : null,
          },
        };
      },
    },
    modelId: {
      type: "string",
      label: "Model Id",
      description: "The ID of the model version that you want to run.",
      async options({ collectionSlug }) {
        const { models } = await this.listModels({
          collectionSlug,
        });
        return models.map(({
          description, name, owner,
        }) => ({
          label: `${name} - ${description}`,
          value: `${owner}/${name}`,
        }));
      },
    },
    modelVersion: {
      type: "string",
      label: "Model Version",
      description: "The version of the model version that you want to use.",
      async options({
        modelId, prevContext,
      }) {
        const {
          results, next,
        } = await this.listModelVersions({
          modelId,
          params: {
            cursor: prevContext.cursor,
          },
        });
        const cursor = next && next.split("cursor=");
        return {
          options: results.map(({
            id, cog_version,
          }) => ({
            label: cog_version,
            value: id,
          })),
          context: {
            cursor: cursor
              ? cursor[1]
              : null,
          },
        };
      },
    },
    predictionId: {
      type: "string",
      label: "Preditction Id",
      description: "The Id of the prediction you want to get.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listPredictions({
          params: {
            cursor: prevContext.cursor,
          },
        });
        const cursor = next && next.split("cursor=");
        return {
          options: results.map(({
            id, cog_version,
          }) => ({
            label: cog_version,
            value: id,
          })),
          context: {
            cursor: cursor
              ? cursor[1]
              : null,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.replicate.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    cancelPrediction({
      predictionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `predictions/${predictionId}/cancel`,
        ...args,
      });
    },
    createPrediction(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "predictions",
        ...args,
      });
    },
    getModel({
      modelId, ...args
    }) {
      return this._makeRequest({
        path: `models/${modelId}`,
        ...args,
      });
    },
    getPrediction({
      predictionId, ...args
    }) {
      return this._makeRequest({
        path: `predictions/${predictionId}`,
        ...args,
      });
    },
    listCollections(args = {}) {
      return this._makeRequest({
        path: "collections",
        ...args,
      });
    },
    listModels({
      collectionSlug, ...args
    }) {
      return this._makeRequest({
        path: `collections/${collectionSlug}`,
        ...args,
      });
    },
    listModelVersions({
      modelId, ...args
    }) {
      return this._makeRequest({
        path: `models/${modelId}/versions`,
        ...args,
      });
    },
    listPredictions(args = {}) {
      return this._makeRequest({
        path: "predictions",
        ...args,
      });
    },
  },
};
