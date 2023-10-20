import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_crm",
  propDefinitions: {
    module: {
      type: "string",
      label: "Module",
      description: "Module where the record will be created",
      async options() {
        const { modules = [] } = await this.listModules();
        return modules.map(({ api_name }) => api_name);
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record",
      async options({
        module, page,
      }) {
        const { data = [] } = await this.listRecords(module, page);
        return data.map((record) => this._getLabelValueForModuleRecord(module, record));
      },
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The ID of the attachment",
      async options({
        module, recordId, page,
      }) {
        const { data = [] } = await this.listAttachments(module, recordId, page);
        return data.map((record) => this._getLabelValueForModuleRecord("Attachments", record));
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `${this.$auth.api_domain}/crm/v2`;
    },
    _metadataUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/settings/modules`;
    },
    _usersUrl(id) {
      const baseUrl = this._apiUrl();
      const basePath = `${baseUrl}/users`;
      return id
        ? `${basePath}/${id}`
        : basePath;
    },
    _watchActionsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/actions/watch`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Zoho-oauthtoken ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _getRequestParams(opts) {
      const {
        path,
        ...extraOpts
      } = opts;
      const baseRequestConfig = this._makeRequestConfig();
      return {
        ...baseRequestConfig,
        url: `${this._apiUrl()}${path}`,
        ...extraOpts,
      };
    },
    _getLabelValueForModuleRecord(moduleType, record) {
      const value = record.id;
      const fieldSelector = {
        "Leads": "Full_Name",
        "Accounts": "Account_Name",
        "Contacts": "Full_Name",
        "Attachments": "File_Name",
        "users?type=\"ActiveUsers\"": "full_name",
      };
      const fieldName = fieldSelector[moduleType];
      const label = record[fieldName] ?? value;
      return {
        label,
        value,
      };
    },
    async genericApiGetCall(url, params = {}) {
      const baseRequestConfig = this._makeRequestConfig();
      const requestConfig = {
        ...baseRequestConfig,
        url,
        params,
      };
      return axios(this, requestConfig);
    },
    usersPageSize() {
      return 200;
    },
    /**
     * This function computes and returns the page number of the users API that
     * would contain new user records, based on the amount of records processed
     * so far, and the users API page size.
     *
     * This is useful when scanning the users API (which returns an append-only
     * list of records) since it allows to skip those pages that contain records
     * that were already seen/processed.
     *
     * @param {object} opts The input parameters for this function
     * @param {number} opts.userCount The amount of users/records by which to
     * offset the page number. Defaults to 0.
     * @param {number} opts.pageSize The size of the users API page. Defaults to
     * 200.
     * @returns The users API page number where new records would be contained
     */
    computeLastUsersPage({
      userCount = 0,
      pageSize = this.usersPageSize(),
    }) {
      return 1 + Math.floor(userCount / pageSize);
    },
    /**
     * This function computes and returns the number of records at the beginning
     * of the users page that were already processed. The computation is based
     * on the total amount of user records processed, as well as the page size
     * of the users API.
     *
     * This is useful when scanning the users API (which returns an append-only
     * list of records) since it allows to skip those records that were already
     * seen/processed.
     *
     * @param {object} opts The input parameters for this function
     * @param {number} opts.userCount The amount of users/records by which to
     * offset the page number. Defaults to 0.
     * @param {number} opts.pageSize The size of the users API page. Defaults to
     * 200.
     * @returns The number of records at the beginning of the users page that
     * were already processed and can be skipped
     */
    computeUsersOffset({
      userCount = 0,
      pageSize = this.usersPageSize(),
    }) {
      return userCount % pageSize;
    },
    async getUserCount({ type }) {
      const url = this._usersUrl();
      const pageSize = this.usersPageSize();
      const params = {
        page_size: pageSize,
        type,
      };
      const { info: { count: userCount } } = await this.genericApiGetCall(url, params);
      return userCount;
    },
    async *getUsers({
      page = 1,
      type,
    }) {
      const url = this._usersUrl();
      let moreRecords = false;
      let params = {
        page,
        type,
      };
      do {
        const {
          users,
          info,
        } = await this.genericApiGetCall(url, params);
        for (const user of users) {
          yield user;
        }

        moreRecords = !!info.moreRecords;
        params = {
          ...params,
          page: page + 1,
        };
      } while (moreRecords);
    },
    async listModules() {
      const url = this._metadataUrl();
      const requestConfig = this._makeRequestConfig();
      const config = {
        method: "GET",
        url,
        ...requestConfig,
      };
      return axios(this, config);
    },
    async createHook(opts) {
      const {
        token,
        notifyUrl,
        channelId,
        channelExpiry,
        events,
      } = opts;

      const url = this._watchActionsUrl();
      const requestConfig = this._makeRequestConfig();

      // A description of each parameter can be found in the developer docs:
      // https://www.zoho.com/crm/developer/docs/api/v2/notifications/enable.html
      const requestData = {
        watch: [
          {
            token,
            notify_url: notifyUrl,
            channel_id: channelId,
            channel_expiry: channelExpiry,
            events,
          },
        ],
      };
      const config = {
        method: "POST",
        url,
        data: requestData,
        ...requestConfig,
      };
      return axios(this, config);
    },
    async deleteHook(channelId) {
      const url = this._watchActionsUrl();

      // `channel_ids` is a comma-separated list of channel ID's, so we convert
      // `channelId` (a number) to a string. See the docs for more information:
      // https://www.zoho.com/crm/developer/docs/api/v2/notifications/disable.html
      const params = {
        channel_ids: `${channelId}`,
      };
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const config = {
        method: "DELETE",
        url,
        ...requestConfig,
      };
      await axios(this, config);
    },
    async renewHookSubscription(opts) {
      const {
        channelId,
        channelExpiry,
        events,
        token,
      } = opts;
      const url = this._watchActionsUrl();
      const requestConfig = this._makeRequestConfig();

      // A description of each parameter can be found in the developer docs:
      // https://www.zoho.com/crm/developer/docs/api/v2/notifications/update-info.html
      const requestData = {
        watch: [
          {
            channel_id: channelId,
            channel_expiry: channelExpiry,

            // The events array must always be provided, even if it's not being
            // changed.
            events,

            // The token must always be provided, even if it's not being
            // changed. Otherwise it will be set to `null`.
            token,
          },
        ],
      };
      const config = {
        method: "PATCH",
        url,
        data: requestData,
        ...requestConfig,
      };
      const data = await axios(this, config);
      const watch = data.watch[0];
      console.log(watch);
      console.log(watch.details);
      if (watch.status !== "success") {
        throw new Error(`${watch.message} ${JSON.stringify(watch.details)}`);
      }
      return data;
    },
    async listFields(moduleType, $) {
      return axios($ ?? this, this._getRequestParams({
        path: "/settings/fields",
        params: {
          module: moduleType,
        },
      }));
    },
    async listRecords(moduleType, page = 0, params, $) {
      return axios($ ?? this, this._getRequestParams({
        path: `/${moduleType}`,
        params: {
          page: page + 1,
          ...params,
        },
      }));
    },
    async convertLead(lead, data, $) {
      return axios($ ?? this, this._getRequestParams({
        method: "POST",
        path: `/Leads/${lead}/actions/convert`,
        data,
      }));
    },
    async getObject(moduleType, recordId, $) {
      return axios($ ?? this, this._getRequestParams({
        path: `/${moduleType}/${recordId}`,
      }));
    },
    async createObject(moduleType, data, $) {
      return axios($ ?? this, this._getRequestParams({
        method: "POST",
        path: `/${moduleType}`,
        data,
      }));
    },
    async updateObject(moduleType, recordId, object, $) {
      return axios($ ?? this, this._getRequestParams({
        method: "PUT",
        path: `/${moduleType}`,
        data: {
          data: [
            {
              ...object,
              id: recordId,
            },
          ],
        },
      }));
    },
    async searchObjects(moduleType, criteria, $) {
      return axios($ ?? this, this._getRequestParams({
        path: `/${moduleType}/search`,
        params: {
          criteria,
        },
      }));
    },
    async listAttachments(moduleType, recordId, page = 0, $) {
      return axios($ ?? this, this._getRequestParams({
        path: `/${moduleType}/${recordId}/Attachments`,
        params: {
          page: page + 1,
        },
      }));
    },
    async downloadAttachment(moduleType, recordId, attachmentId, $) {
      return axios($ ?? this, this._getRequestParams({
        path: `/${moduleType}/${recordId}/Attachments/${attachmentId}`,
        responseType: "arraybuffer",
      }));
    },
    async uploadAttachment(moduleType, recordId, data, $) {
      return axios($ ?? this, {
        url: `https://www.zohoapis.com/crm/v3/${moduleType}/${recordId}/Attachments`,
        method: "POST",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this._authToken()}`,
          "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        },
        data,
      });
    },
    omitEmptyStringValues(obj) {
      return Object.entries(obj).reduce((a, [
        k,
        v,
      ]) => (v != null && v !== ""
        ? (a[k] = v, a)
        : a), {});
    },
  },
};
