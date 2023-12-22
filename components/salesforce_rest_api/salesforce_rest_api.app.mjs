import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salesforce_rest_api",
  propDefinitions: {
    sobjectId: {
      type: "string",
      label: "SObject ID",
      description: "ID of the Standard object to get field values from",
      async options(context) {
        const { objectType } = context;
        const { recentItems } = await this.listSObjectTypeIds(objectType);
        return recentItems.map((item) => ({
          label: item.Name,
          value: item.Id,
        }));
      },
    },
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
    fieldUpdatedTo: {
      type: "string",
      label: "Field Updated to",
      description:
        "If provided, the trigger will only fire when the updated field is an EXACT MATCH (including spacing and casing) to the value you provide in this field",
      optional: true,
    },
    fieldSelector: {
      type: "string[]",
      label: "Field Selector",
      description: "Select fields for the Standard Object",
      options: () => [], // override options for each object, e.g., () => Object.keys(account)
    },
    AcceptedEventInviteeIds: {
      type: "string[]",
      label: "Accepted Event Invitee IDs",
      async options() {
        const { recentItems: contacts } = await this.listSObjectTypeIds("Contact");
        const { recentItems: leads } = await this.listSObjectTypeIds("Lead");
        const allContacts = [
          ...contacts,
          ...leads,
        ];
        return allContacts.map(({
          Name, Id,
        }) => ({
          label: Name,
          value: Id,
        }));
      },
      description: "A string array of contact or lead IDs who accepted this event. This JunctionIdList is linked to the AcceptedEventRelation child relationship. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
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
    _sObjectTypeUpdatedApiUrl(sObjectType) {
      const baseUrl = this._sObjectTypeApiUrl(sObjectType);
      return `${baseUrl}/updated`;
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
    async getHistorySObjectForObjectType(objectType) {
      const { sobjects } = await this.listSObjectTypes();
      const historyObject = sobjects.find(
        (sobject) =>
          sobject.associateParentEntity === objectType &&
          this.isHistorySObject(sobject),
      );
      return historyObject;
    },
    async createObject(objectType, data) {
      const url = `${this._sObjectsApiUrl()}/${objectType}`;
      return this._makeRequest({
        url,
        data,
        method: "POST",
      });
    },
    async deleteObject(objectType, sobjectId) {
      const url = `${this._sObjectsApiUrl()}/${objectType}/${sobjectId}`;
      return this._makeRequest({
        url,
        method: "DELETE",
      });
    },
    async getRecords(objectType, params) {
      const url = `${this._sCompositeApiUrl()}/${objectType}`;
      return this._makeRequest({
        url,
        params,
      });
    },
    async getSObject(objectType, id, params = null) {
      const url = this._sObjectDetailsApiUrl(objectType, id);
      return this._makeRequest({
        url,
        params,
      });
    },
    async getUpdatedForObjectType(objectType, start, end) {
      const url = this._sObjectTypeUpdatedApiUrl(objectType);
      const params = {
        start: this._formatDateString(start),
        end: this._formatDateString(end),
      };
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
    async createAccount({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Account");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async updateAccount({
      $, id, data,
    }) {
      const url = this._sObjectDetailsApiUrl("Account", id);
      return this._makeRequest({
        $,
        url,
        method: "PATCH",
        data,
      });
    },
    async createAttachment({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Attachment");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createCampaign({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Campaign");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createCase({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Case");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createCaseComment({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("CaseComment");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createContact({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Contact");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async updateContact({
      $, id, data,
    }) {
      const url = this._sObjectDetailsApiUrl("Contact", id);
      return this._makeRequest({
        $,
        url,
        method: "PATCH",
        data,
      });
    },
    async createEvent({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Event");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createLead({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Lead");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createNote({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Note");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async createOpportunity({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Opportunity");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async updateOpportunity({
      $, id, data,
    }) {
      const url = this._sObjectDetailsApiUrl("Opportunity", id);
      return this._makeRequest({
        $,
        url,
        method: "PATCH",
        data,
      });
    },
    async getRecordFieldValues(sobjectName, {
      $, id, params,
    }) {
      const url = this._sObjectDetailsApiUrl(sobjectName, id);
      return this._makeRequest({
        $,
        url,
        params,
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
    async createTask({
      $, data,
    }) {
      const url = this._sObjectTypeApiUrl("Task");
      return this._makeRequest({
        $,
        url,
        method: "POST",
        data,
      });
    },
    async deleteOpportunity({
      $, id,
    }) {
      const url = this._sObjectDetailsApiUrl("Opportunity", id);
      return this._makeRequest({
        $,
        url,
        method: "DELETE",
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
    async postFeed(args = {}) {
      const baseUrl = this._baseApiVersionUrl();
      const url = `${baseUrl}/chatter/feed-elements`;
      return this._makeRequest({
        url,
        method: "POST",
        ...args,
      });
    },
  },
};
