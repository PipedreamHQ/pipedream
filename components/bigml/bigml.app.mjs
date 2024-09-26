import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bigml",
  propDefinitions: {
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The ID of the source",
      async options({ prevContext }) {
        const {
          meta,
          objects: sources,
        } = await this.listSources({
          params: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            offset: prevContext.offset,
          },
        });
        return {
          context: {
            offset: meta.offset + meta.limit,
          },
          options: sources.map((source) => ({
            label: source.name,
            value: source.resource,
          })),
        };
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset",
      async options({ prevContext }) {
        const {
          meta,
          objects: datasets,
        } = await this.listDatasets({
          params: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            offset: prevContext.offset,
          },
        });
        return {
          context: {
            offset: meta.offset + meta.limit,
          },
          options: datasets.map((dataset) => ({
            label: dataset.name,
            value: dataset.resource,
          })),
        };
      },
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model",
      async options({ prevContext }) {
        const {
          meta,
          objects: models,
        } = await this.listModels({
          params: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            offset: prevContext.offset,
          },
        });
        return {
          context: {
            offset: meta.offset + meta.limit,
          },
          options: models.map((model) => ({
            label: model.name,
            value: model.resource,
          })),
        };
      },
    },
  },
  methods: {
    _username() {
      return this.$auth.username;
    },
    _auth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: "https://bigml.io/andromeda" + path,
        params: {
          ...opts.params,
          username: this._username(),
          api_key: this._auth(),
        },
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const results = [];
      const limit = constants.MAX_LIMIT;
      let offset = 0;

      while (true) {
        const {
          meta,
          objects,
        } = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit,
            offset,
          },
        });

        results.push(...objects);
        offset += limit;

        if (!meta.next) {
          return {
            meta,
            objects: results,
          };
        }
      }
    },
    async listSources({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listSources,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/source",
      });
    },
    async listDatasets({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listDatasets,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/dataset",
      });
    },
    async listModels({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listModels,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/model",
      });
    },
    async listPredictions({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listPredictions,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/prediction",
      });
    },
    async getResource({
      resource, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/${resource}`,
      });
    },
    async createSource(opts) {
      return this._makeRequest({
        ...opts,
        path: "/source",
        method: "post",
      });
    },
    async createModel(opts) {
      return this._makeRequest({
        ...opts,
        path: "/model",
        method: "post",
      });
    },
    async createBatchPrediction(opts) {
      return this._makeRequest({
        ...opts,
        path: "/batchprediction",
        method: "post",
      });
    },
  },
};
