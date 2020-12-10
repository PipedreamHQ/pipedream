const axios = require("axios");

module.exports = {
  type: "app",
  app: "salesforce_rest_api",
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _instance() {
      return this.$auth.yourinstance;
    },
    _apiVersion() {
      return "50.0";
    },
    _baseApiUrl() {
      const instance = this._instance();
      return `https://${instance}.salesforce.com`;
    },
    _userApiUrl() {
      const baseUrl = this._baseApiUrl();
      return `${baseUrl}/services/oauth2/userinfo`;
    },
    _sObjectsApiUrl() {
      const baseUrl = this._baseApiUrl();
      const apiVersion = this._apiVersion();
      return `${baseUrl}/services/data/v${apiVersion}/sobjects`;
    },
    _sObjectTypeDescriptionApiUrl(sObjectType) {
      const baseUrl = this._sObjectsApiUrl();
      return `${baseUrl}/${sObjectType}/describe`;
    },
    _sObjectTypeUpdatedApiUrl(sObjectType) {
      const baseUrl = this._sObjectsApiUrl();
      return `${baseUrl}/${sObjectType}/updated`;
    },
    _sObjectTypeDeletedApiUrl(sObjectType) {
      const baseUrl = this._sObjectsApiUrl();
      return `${baseUrl}/${sObjectType}/deleted`;
    },
    _sObjectDetailsApiUrl(sObjectType, id) {
      const baseUrl = this._sObjectsApiUrl();
      return `${baseUrl}/${sObjectType}/${id}`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _formatDateString(dateString) {
      // Remove milliseconds from date ISO string
      return dateString.replace(/\.[0-9]{3}/, "");
    },
    async listSObjectTypes() {
      const url = this._sObjectsApiUrl();
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async getNameFieldForObjectType(objectType) {
      const url = this._sObjectTypeDescriptionApiUrl(objectType);
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      const nameField = data.fields.find(f => f.nameField);
      return nameField !== undefined ? nameField.name : 'Id';
    },
    async getSObject(objectType, id) {
      const url = this._sObjectDetailsApiUrl(objectType, id);
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async getUpdatedForObjectType(objectType, start, end) {
      const url = this._sObjectTypeUpdatedApiUrl(objectType);
      const params = {
        start: this._formatDateString(start),
        end: this._formatDateString(end),
      };
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async getDeletedForObjectType(objectType, start, end) {
      const url = this._sObjectTypeDeletedApiUrl(objectType);
      const params = {
        start: this._formatDateString(start),
        end: this._formatDateString(end),
      };
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
  },
};
