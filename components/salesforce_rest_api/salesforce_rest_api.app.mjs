import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salesforce_rest_api",
  propDefinitions: {
    objectType: {
      type: "string",
      label: "SObject Type",
      description: "Standard object type of the record to get field values from",
      async options({
        page,
        filter = this.isValidSObject,
        mapper =  ({
          label, name: value,
        }) => ({
          label,
          value,
        }),
      }) {
        if (page !== 0) {
          return [];
        }
        const { sobjects } = await this.listSObjectTypes();
        return sobjects.filter(filter).map(mapper);
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record of the selected object type.",
      async options({
        objType,
        nameField,
      }) {
        if (!nameField) nameField = await this.getNameFieldForObjectType(objType);
        return this.listRecordOptions({
          objType,
          nameField,
        });
      },
    },
    field: {
      type: "string",
      label: "Field",
      description: "The object field to watch for changes",
      async options({
        page, objectType, filter = () => true,
      }) {
        if (page !== 0) {
          return [];
        }

        const fields = await this.getFieldsForObjectType(objectType);
        return fields.filter(filter).map(({ name }) => name);
      },
    },
    fieldsToUpdate: {
      type: "string[]",
      label: "Fields to Update",
      description: "Select the field(s) you want to update for this record.",
      async options({ objType }) {
        const fields = await this.getFieldsForObjectType(objType);
        return fields.filter((field) => field.updateable).map(({ name }) => name);
      },
    },
    fieldsToObtain: {
      type: "string[]",
      label: "Fields to Obtain",
      description: "Select the field(s) to obtain for the selected record(s) (or all records).",
      async options({ objType }) {
        const fields = await this.getFieldsForObjectType(objType);
        return fields.map(({ name }) => name);
      },
    },
    useAdvancedProps: {
      type: "boolean",
      label: "See All Props",
      description: "Set to true to see all available props for this object.",
      optional: true,
      reloadProps: true,
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
        this._instanceUrl() || `https://${this._subdomain()}.salesforce.com`
      );
    },
    _userApiUrl() {
      const baseUrl = this._baseApiUrl();
      return `${baseUrl}/services/oauth2/userinfo`;
    },
    _baseApiVersionUrl() {
      const baseUrl = this._baseApiUrl();
      const apiVersion = this._apiVersion();
      return `${baseUrl}/services/data/v${apiVersion}`;
    },
    _sObjectsApiUrl() {
      const baseUrl = this._baseApiVersionUrl();
      return `${baseUrl}/sobjects`;
    },
    _sCompositeApiUrl() {
      const baseUrl = this._baseApiUrl();
      const apiVersion = this._apiVersion();
      return `${baseUrl}/services/data/v${apiVersion}/composite/sobjects`;
    },
    _sObjectTypeApiUrl(sObjectType) {
      const baseUrl = this._sObjectsApiUrl();
      return `${baseUrl}/${sObjectType}`;
    },
    _sObjectTypeDescriptionApiUrl(sObjectType) {
      const baseUrl = this._sObjectTypeApiUrl(sObjectType);
      return `${baseUrl}/describe`;
    },
    _sObjectTypeDeletedApiUrl(sObjectType) {
      const baseUrl = this._sObjectTypeApiUrl(sObjectType);
      return `${baseUrl}/deleted`;
    },
    _sObjectDetailsApiUrl(sObjectType, id) {
      const baseUrl = this._sObjectTypeApiUrl(sObjectType);
      return `${baseUrl}/${id}`;
    },
    _makeRequestHeaders() {
      const authToken = this._authToken();
      return {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    _makeRequestConfig() {
      const headers = this._makeRequestHeaders();
      return {
        method: "GET",
        headers,
      };
    },
    async _makeRequest(opts) {
      const {
        $,
        ...requestOpts
      } = opts;
      const baseRequestConfig = this._makeRequestConfig();
      const requestConfig = {
        ...baseRequestConfig,
        ...requestOpts,
      };
      return axios($ ?? this, requestConfig);
    },
    _formatDateString(dateString) {
      // Remove milliseconds from date ISO string
      return dateString.replace(/\.[0-9]{3}/, "");
    },
    isValidSObject(sobject) {
      // Only the activity of those SObject types that have the `replicateable`
      // flag set is published via the `getUpdated` API.
      //
      // See the API docs here: https://sforce.co/3gDy3uP
      return sobject.replicateable;
    },
    isHistorySObject(sobject) {
      return (
        sobject.associateEntityType === "History" &&
        sobject.name.includes("History")
      );
    },
    async listSObjectTypes() {
      const url = this._sObjectsApiUrl();
      return this._makeRequest({
        url,
      });
    },
    async listSObjectTypeIds(objectType) {
      const url = this._sObjectTypeApiUrl(objectType);
      return this._makeRequest({
        url,
      });
    },
    async getNameFieldForObjectType(objectType) {
      const url = this._sObjectTypeDescriptionApiUrl(objectType);
      const data = await this._makeRequest({
        debug: true,
        url,
      });
      const nameField = data.fields.find((f) => f.nameField);
      return nameField !== undefined
        ? nameField.name
        : "Id";
    },
    async getFieldsForObjectType(objectType) {
      const url = this._sObjectTypeDescriptionApiUrl(objectType);
      const data = await this._makeRequest({
        url,
      });
      return data.fields;
    },
    async createObject({
      objectType, ...args
    }) {
      return this._makeRequest({
        url: `${this._sObjectsApiUrl()}/${objectType}`,
        method: "POST",
        ...args,
      });
    },
    async deleteRecord({
      sobjectType, recordId, ...args
    }) {
      const url = `${this._sObjectsApiUrl()}/${sobjectType}/${recordId}`;
      return this._makeRequest({
        url,
        method: "DELETE",
        ...args,
      });
    },
    async getRecords({
      objectType, ...args
    }) {
      const url = `${this._sCompositeApiUrl()}/${objectType}`;
      return this._makeRequest({
        url,
        ...args,
      });
    },
    async getSObject(objectType, id, params = null) {
      const url = this._sObjectDetailsApiUrl(objectType, id);
      return this._makeRequest({
        url,
        params,
      });
    },
    async getDeletedForObjectType(objectType, start, end) {
      const url = this._sObjectTypeDeletedApiUrl(objectType);
      const params = {
        start: this._formatDateString(start),
        end: this._formatDateString(end),
      };
      return this._makeRequest({
        url,
        params,
      });
    },
    async getUserInfo(authToken) {
      const url = this._userApiUrl();
      return this._makeRequest({
        url,
        headers: {
          ...this._makeRequestHeaders(),
          Authorization: `Bearer ${authToken}`,
        },
      });
    },
    async createRecord(sobjectName, {
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl(sobjectName);
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async updateRecord(sobjectName, {
      $, id, data,
    }) {
      const url = this._sObjectDetailsApiUrl(sobjectName, id);
      return this._makeRequest({
        $,
        url,
        method: "PATCH",
        data,
      });
    },
    async query({
      $, query,
    }) {
      const baseUrl = this._baseApiVersionUrl();
      const url = `${baseUrl}/query/?q=${encodeURIComponent(query)}`;
      return this._makeRequest({
        $,
        url,
      });
    },
    async listRecordOptions({
      objType,
      nameField = "Id",
    }) {
      const fields = [
        "Id",
        ...nameField === "Id"
          ? []
          : [
            nameField,
          ],
      ];
      const { records } = await this.query({
        query: `SELECT ${fields.join(", ")} FROM ${objType}`,
      });
      return records?.map?.((item) => ({
        label: item[nameField],
        value: item.Id,
      })) ?? [];
    },
    async search({
      $, search,
    }) {
      const baseUrl = this._baseApiVersionUrl();
      const url = `${baseUrl}/search/?q=${encodeURIComponent(search)}`;
      return this._makeRequest({
        $,
        url,
      });
    },
    async parameterizedSearch(args) {
      const baseUrl = this._baseApiVersionUrl();
      const url = `${baseUrl}/parameterizedSearch/`;

      return this._makeRequest({
        url,
        method: "GET",
        ...args,
      });
    },
    async insertBlobData(sobjectName, {
      $, headers, data,
    }) {
      const url = this._sObjectTypeApiUrl(sobjectName);
      const requestConfig = {
        url,
        method: "POST",
        data,
        headers: {
          ...this._makeRequestHeaders(),
          ...headers,
        },
      };
      return axios($ ?? this, requestConfig);
    },
    async postFeed(args) {
      const baseUrl = this._baseApiVersionUrl();
      const url = `${baseUrl}/chatter/feed-elements`;
      return this._makeRequest({
        url,
        method: "POST",
        ...args,
      });
    },
    createBulkJob(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        url: `${this._baseApiVersionUrl()}/jobs/ingest`,
        data: {
          contentType: "CSV",
          columnDelimiter: "COMMA",
          lineEnding: "LF",
          ...args?.data,
        },
      });
    },
    uploadBulkJobData({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        ...args,
        method: "PUT",
        url: `${this._baseApiVersionUrl()}/jobs/ingest/${jobId}/batches`,
        headers: {
          ...this._makeRequestHeaders(),
          "Content-Type": "text/csv",
        },
      });
    },
    patchBulkJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        ...args,
        method: "PATCH",
        url: `${this._baseApiVersionUrl()}/jobs/ingest/${jobId}`,
      });
    },
    getBulkJobInfo({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        ...args,
        url: `${this._baseApiVersionUrl()}/jobs/ingest/${jobId}`,
      });
    },
    getKnowledgeArticles(args = {}) {
      return this._makeRequest({
        url: `${this._baseApiVersionUrl()}/support/knowledgeArticles`,
        ...args,
      });
    },
    getKnowledgeDataCategoryGroups(args = {}) {
      return this._makeRequest({
        url: `${this._baseApiVersionUrl()}/support/dataCategoryGroups`,
        ...args,
      });
    },
    async paginate({
      requester, requesterArgs, resultsKey = "articles",
      maxRequests = 3, pageSize = 100,
    } = {}) {
      let allItems = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore && currentPage <= maxRequests) {
        const response = await requester({
          ...requesterArgs,
          params: {
            ...requesterArgs?.params,
            pageSize,
            pageNumber: currentPage,
          },
        });

        const items = response[resultsKey];
        if (items?.length) {
          allItems = [
            ...allItems,
            ...items,
          ];
        }

        hasMore = !!response.nextPageUrl;
        currentPage++;
      }

      return allItems;
    },
  },
};
