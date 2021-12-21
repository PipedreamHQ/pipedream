const axios = require("axios");
const { SalesforceClient } = require("salesforce-webhooks");

module.exports = {
  type: "app",
  app: "salesforce_rest_api",
  propDefinitions: {
    field: {
      type: "string",
      label: "Field",
      description: "The object field to watch for changes",
      async options(context) {
        const {
          page,
          objectType,
        } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const fields = await this.getFieldsForObjectType(objectType);
        return fields.map((field) => field.name);
      },
    },
    fieldUpdatedTo: {
      type: "string",
      label: "Field Updated to",
      description: "If provided, the trigger will only fire when the updated field is an EXACT MATCH (including spacing and casing) to the value you provide in this field",
      optional: true,
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _instance() {
      return this.$auth.yourinstance;
    },
    _instanceUrl() {
      return this.$auth.instance_url;
    },
    _subdomain() {
      return (
        this._instance() ||
        this._instanceUrl()
          .replace("https://", "")
          .replace(".salesforce.com", "")
      );
    },
    _apiVersion() {
      return "50.0";
    },
    _baseApiUrl() {
      return (
        this._instanceUrl() ||
        `https://${this._subdomain()}.salesforce.com`
      );
    },
    userApiUrl() {
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
    _getSalesforceClient() {
      const clientOpts = {
        apiVersion: this._apiVersion(),
        authToken: this._authToken(),
        instance: this._subdomain(),
      };
      return new SalesforceClient(clientOpts);
    },
    isHistorySObject(sobject) {
      return sobject.associateEntityType === "History" && sobject.name.includes("History");
    },
    listAllowedSObjectTypes(eventType) {
      const verbose = true;
      return SalesforceClient.getAllowedSObjects(eventType, verbose);
    },
    async createWebhook(endpointUrl, sObjectType, event, secretToken, opts) {
      const {
        fieldsToCheck,
        fieldsToCheckMode,
      } = opts;
      const client = this._getSalesforceClient();
      const webhookOpts = {
        endpointUrl,
        sObjectType,
        event,
        secretToken,
        fieldsToCheck,
        fieldsToCheckMode,
      };
      return client.createWebhook(webhookOpts);
    },
    async deleteWebhook(webhookData) {
      const client = this._getSalesforceClient();
      return client.deleteWebhook(webhookData);
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
      const nameField = data.fields.find((f) => f.nameField);
      return nameField !== undefined
        ? nameField.name
        : "Id";
    },
    async getFieldsForObjectType(objectType) {
      const url = this._sObjectTypeDescriptionApiUrl(objectType);
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      return data.fields;
    },
    async getHistorySObjectForObjectType(objectType) {
      const { sobjects } = await this.listSObjectTypes();
      const historyObject = sobjects.find(
        (sobject) => sobject.associateParentEntity === objectType
            && this.isHistorySObject(sobject),
      );
      return historyObject;
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
