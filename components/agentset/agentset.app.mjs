import { axios } from "@pipedream/platform";
import { STATUSES_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "agentset",
  propDefinitions: {
    namespaceId: {
      type: "string",
      label: "Namespace ID",
      description: "The ID of the namespace",
      async options() {
        const { data } = await this.listNamespaces();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by status",
      options: STATUSES_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.agentset.ai/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listNamespaces(opts = {}) {
      return this._makeRequest({
        path: "/namespace",
        ...opts,
      });
    },
    createNamespace(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/namespace",
        ...opts,
      });
    },
    createIngestJob({
      namespaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/namespace/${namespaceId}/ingest-jobs`,
        ...opts,
      });
    },
    listIngestJobs({
      namespaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/namespace/${namespaceId}/ingest-jobs`,
        ...opts,
      });
    },
    listDocuments({
      namespaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/namespace/${namespaceId}/documents`,
        ...opts,
      });
    },
    searchNamespace({
      namespaceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/namespace/${namespaceId}/search`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let count = 0;
      let cursor;

      do {
        params.cursor = cursor;
        const {
          data,
          pagination: { nextCursor },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        cursor = nextCursor;

      } while (cursor);
    },
  },
};

