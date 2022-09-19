import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adalo",
  propDefinitions: {},
  methods: {
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
    async getRecords({
      collectionId, ...args
    } = {}) {
      const response = await this._makeRequest({
        path: `/collections/${collectionId}`,
        ...args,
      });

      return response.records;
    },
    async createRecord({
      collectionId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/collections/${collectionId}`,
        method: "post",
        ...args,
      });
    },
    async updateRecord({
      collectionId, recordId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/collections/${collectionId}/${recordId}`,
        method: "put",
        ...args,
      });
    },
  },
};
