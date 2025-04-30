import { axios } from "@pipedream/platform";
const LIMIT = 50;

export default {
  type: "app",
  app: "influxdb_cloud",
  propDefinitions: {
    bucketId: {
      type: "string",
      label: "Bucket ID",
      description: "The identifier of a bucket",
      async options({ page }) {
        const { buckets } = await this.listBuckets({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return buckets?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    scriptId: {
      type: "string",
      label: "Script ID",
      description: "The identifier of a script",
      async options({ page }) {
        const { scripts } = await this.listScripts({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return scripts?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl(version) {
      let { url } = this.$auth;
      if (version === "v2") {
        url += (url.endsWith("/")
          ? ""
          : "/") + "api/v2";
      } else {
        url = url.endsWith("/")
          ? url.slice(0, -1)
          : url;
      }
      return url;
    },
    _makeRequest({
      $ = this,
      version = "v2",
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl(version)}${path}`,
        headers: {
          "Authorization": `Token ${this.$auth.token}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...opts,
      });
    },
    listBuckets(opts = {}) {
      return this._makeRequest({
        path: "/buckets",
        ...opts,
      });
    },
    listScripts(opts = {}) {
      return this._makeRequest({
        path: "/scripts",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    updateBucket({
      bucketId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/buckets/${bucketId}`,
        ...opts,
      });
    },
    writeData(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/write",
        ...opts,
      });
    },
    invokeScript({
      scriptId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/scripts/${scriptId}/invoke`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      resourceKey,
      params,
      max,
    }) {
      params = {
        ...params,
        limit: LIMIT,
        offset: 0,
      };
      let total, count = 0;
      do {
        const response = await fn({
          params,
        });
        const results = resourceKey
          ? response[resourceKey]
          : response;
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = results?.length;
        params.offset += params.limit;
      } while (total);
    },
  },
};
