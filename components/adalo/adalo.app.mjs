import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adalo",
  methods: {
    _collectionId() {
      return this.$auth.collection_id;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _appId() {
      return this.$auth.appId;
    },
    _apiUrl() {
      return `https://api.adalo.com/v0/apps/${this._appId()}`;
    },
    async _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async paginateResources({
      requestFn, requestArgs, resourceName, mapper,
    }) {
      const limit = requestArgs.params?.limit ?? 100;
      const offset = (requestArgs.params?.offset ?? 0) + limit;

      const { [resourceName]: resources } =
        await requestFn({
          ...requestArgs,
          params: {
            limit,
            ...requestArgs.params,
          },
        });

      return {
        options: resources.map(mapper),
        context: {
          offset,
          total: resources.length,
        },
      };
    },
    getRecords(args = {}) {
      return this._makeRequest({
        path: `/collections/${this._collectionId()}`,
        ...args,
      });
    },
    createRecord(args = {}) {
      return this._makeRequest({
        path: `/collections/${this._collectionId()}`,
        method: "post",
        ...args,
      });
    },
    updateRecord({
      recordId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/collections/${this._collectionId()}/${recordId}`,
        method: "put",
        ...args,
      });
    },
  },
};
