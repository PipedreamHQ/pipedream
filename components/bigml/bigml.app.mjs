import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bigml",
  propDefinitions: {
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
          return results;
        }
      }
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
    async getResource({
      resource, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/${resource}`,
      });
    },
  },
};
