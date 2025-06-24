import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "keboola",
  propDefinitions: {
    bucketId: {
      type: "string",
      label: "Bucket ID",
      description: "The ID of the bucket",
      async options() {
        const buckets = await this.listBuckets();
        return buckets.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      async options({ bucketId }) {
        const tables = await this.listTablesInBucket({
          bucketId,
        });
        return tables.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.stack_endpoint}/v2/storage`;
    },
    _headers() {
      return {
        "x-storageapi-token": `${this.$auth.api_token}`,
        "content-type": "multipart/form-data",
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
    listBuckets(opts = {}) {
      return this._makeRequest({
        path: "/buckets",
        ...opts,
      });
    },
    getBucketDetails({
      bucketId, ...opts
    }) {
      return this._makeRequest({
        path: `/buckets/${bucketId}`,
        ...opts,
      });
    },
    listTablesInBucket({
      bucketId, ...opts
    }) {
      return this._makeRequest({
        path: `/buckets/${bucketId}/tables`,
        ...opts,
      });
    },
    getTableDetails({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${tableId}`,
        ...opts,
      });
    },
    updateBucket({
      bucketId, displayName, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/buckets/${bucketId}`,
        data: {
          displayName,
        },
        ...opts,
      });
    },
    updateTable({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tables/${tableId}`,
        ...opts,
      });
    },
  },
};
