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
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
          "Content-Type": "application/json",
        },
        ...options,
      });
    },
    async getRecords({
      $, collectionId,
    }) {
      const { records } = await this._makeRequest(`collections/${collectionId}`, {}, $);

      return records;
    },
    async createRecord({
      $, collectionId, data,
    }) {
      return this._makeRequest(`collections/${collectionId}`, {
        method: "post",
        data,
      }, $);
    },
    async updateRecord({
      $, collectionId, recordId, data,
    }) {
      return this._makeRequest(`collections/${collectionId}/${recordId}`, {
        method: "put",
        data,
      }, $);
    },
  },
};
