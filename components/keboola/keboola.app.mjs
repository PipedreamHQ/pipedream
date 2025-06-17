import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "keboola",
  propDefinitions: {
    bucketId: {
      type: "string",
      label: "Bucket ID",
      description: "Select a bucket",
      async options() {
        const buckets = await this.listBuckets();
        return buckets.map((bucket) => ({
          label: bucket.name,
          value: bucket.id,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "Select a table",
      async options({ bucketId }) {
        const tables = await this.listTablesInBucket({
          bucketId,
        });
        return tables.map((table) => ({
          label: table.name,
          value: table.id,
        }));
      },
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The new display name for the bucket",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the table",
    },
  },
  methods: {
    _baseUrl() {
      return "https://connection.keboola.com/v2/storage";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-StorageApi-Token": this.$auth.api_key,
        },
      });
    },
    async listBuckets(opts = {}) {
      return this._makeRequest({
        path: "/buckets",
        ...opts,
      });
    },
    async getBucketDetails({
      bucketId, ...opts
    }) {
      return this._makeRequest({
        path: `/buckets/${bucketId}`,
        ...opts,
      });
    },
    async listTablesInBucket({
      bucketId, ...opts
    }) {
      return this._makeRequest({
        path: `/buckets/${bucketId}/tables`,
        ...opts,
      });
    },
    async getTableDetails({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${tableId}`,
        ...opts,
      });
    },
    async updateBucket({
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
    async updateTableName({
      tableId, name, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tables/${tableId}`,
        data: {
          name,
        },
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
