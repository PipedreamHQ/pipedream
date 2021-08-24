const axios = require("axios");
const retry = require("async-retry");
const get = require("lodash/get");

module.exports = {
  type: "app",
  app: "zoho_crm",
  propDefinitions: {
    criteria: {
      type: "string",
      label: "Criteria",
      description:
        "Your search will be performed using the criteria enter here. It must match the following pattern: `(({api_name}:{starts_with|equals}:{value})and/or({api_name}:{starts_with|equals}:{value}))`. Example: `((Last_Name:equals:Burns%5C%2CB)and(First_Name:starts_with:M))`",
    },
    module: {
      type: "string",
      label: "Module",
      description: "Module where the record will be created.",
      async options() {
        const { modules } = await this.listModules();
        const options = [];
        modules.forEach((module) => {options.push(module.api_name);});
        return options;
      },
      default: "Leads",
    },
    overWrite: {
      type: "boolean",
      label: "Overwrite?",
      description: "Sspecifies if the existing tags are to be overwritten.",
      default: false,
    },
    record: {
      type: "object",
      label: "Record",
      description:
        "The new record data. Depending on the selected module, certain fields must be presented in the record being created. I.e. for Leads `Last_Name` is required, see more at Zoho CRM [Insert Records](https://www.zoho.com/crm/developer/docs/api/v2.1/insert-records.html) API docs.",
    },
    recordId: {
      type: "string",
      label: "Record Id",
      description:
        "Unique identifier of the record you'd like to add an attachment.",
    },
    trigger: {
      type: "string[]",
      label: "Trigger",
      description: "An string array with the triggers, workflow actions, related to this record you'd like to be executed. Use an empty array `[]` to not execute any of the workflows (default).",
      default: [],
      optional: true,
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `${this.$auth.api_domain}/crm/v2`;
    },
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    _leadsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/Leads`;
    },
    _metadataUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/settings/modules`;
    },
    _usersUrl(id) {
      const baseUrl = this._apiUrl();
      const basePath = `${baseUrl}/users`;
      return id ?
        `${basePath}/${id}`
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
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.response, null, 2)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    /**
     * Adds a file attachment to the given module record.
     * @param {string} module the Zoho CRM module where the record to add tags on is located..
     * @param {object} recordId unique identifier of the record to add tags on.
     * @param {array} fileName file name of the file to attach. the file must exists under the
     * Pipedream workflow's execution environment '/tmp' folder.
     * @returns {data: array} a one element array with the results of the add attachment operation.
     */
    async addAttachment(module, recordId, fileName) {
      const baseUrl = this._apiUrl();
      const url = `${baseUrl}/${module}/${recordId}/Attachments`;
      const requestConfig = this._makeRequestConfig();
      const FormData = require("form-data");
      const fs = require("fs");
      const requestData = new FormData();
      const file = fs.createReadStream(`/tmp/${fileName}`);
      requestData.append("file", file, fileName);
      requestConfig.headers["Content-type"] = `multipart/form-data; boundary=${requestData._boundary}`;
      const { data } = await this._withRetries(() =>
        axios.post(url, requestData, requestConfig));
      return data;
    },
    /**
     * Add new tags to an existing module record.
     * @param {string} module the Zoho CRM module where the record to add tags on is located..
     * @param {object} recordId unique identifier of the record to add tags on.
     * @param {array} tagNames the tags to add to the record.
     * @param {boolean} overWrite flag that specifies if the existing tags are to be overwritten.
     * @returns {data: array, wf_scheduler: boolean, success_count: integer} an array with the
     * result of the add operation for each tag, `wf_scheduler` a flag that indicates in there was a
     * workflow scheduler triggered by the add tag operation, and the count `success_count` of
     * succesfully added tags.
     */
    async addTags(module, recordId, tagNames, overWrite) {
      const baseUrl = this._apiUrl();
      const url = `${baseUrl}/${module}/${recordId}/actions/add_tags`;
      const requestConfig = this._makeRequestConfig();
      requestConfig["params"] = {
        tag_names: tagNames.join(","),
        over_write: overWrite,
      };
      requestConfig.URL = url;
      const { data } = await this._withRetries(() =>
        axios.post(url, requestConfig));
      return data;
    },
    /**
     * Creates a new record in the specified module.
     *
     * @param {string} module the Zoho CRM module where the record will be created.
     * @param {object} record the record data. this object's structure must match the structure for
     *  the records in the specified module
     * @param {array} trigger the triggers, workflow actions, related to this record to be
     * executed when the record is created. Use an empty array `[]` to not execute any of the
     * workflows.
     * @returns {data: array} a one element array with the results of the create record operation.
     * Exact structure depends on the module being returned.
     */
    async createModuleRecord(module, record, trigger) {
      const url = `${this._apiUrl()}/${module}`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        data: [
          record,
        ],
        trigger,
      };
      const { data } = await this._withRetries(() =>
        axios.post(url, requestData, requestConfig));
      return data;
    },
    /**
     * Converts a lead into a contact or an account.
     *
     * @param {string} leadId unique identifier of the Lead to convert.
     * @param {object} opts optional parameters for this function
     * @param {boolean} opts.overwrite sspecifies if the lead details must be overwritten in
     * the Contact/Account/Deal based on lead conversion mapping configuration.
     * @param {boolean} opts.notify_lead_owner sspecifies whether the lead owner must get
     *  notified about the lead conversion via email.
     * @param {boolean} opts.notify_new_entity_owner sspecifies whether the user to whom
     * the contact/account is assigned to must get notified about the lead conversion via
     * email.
     * @param {string} opts.Accounts unique identifier of an account to associate with the lead
     * being converted.
     * @param {string} opts.Contacts unique identifier of a contact to associate with the lead
     * being converted.
     * @param {string} opts.assign_to unique identifier of the record owner for the new contact and
     * account.
     * @param {object} opts.Deals creates a deal for the newly created account. within this object,
     * "Deal_Name", "Closing_Date", and "Stage" are required.
     * @param {object} opts.carry_over_tags carries over tags of the lead to contact, account, and
     * deal. For exact structure check the Sample input in the API docs:
     * https://www.zoho.com/crm/developer/docs/api/v2/convert-lead.html
     * @returns {data: array} a one element array with the associated `Contacts`, `Deals`,
     * `Accounts` resulted in the conversion.
     */
    async convertLead(leadId, opts) {
      const url = `${this._leadsUrl()}/${leadId}/actions/convert`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        data: opts,
      };
      const { data } = await this._withRetries(() =>
        axios.post(url, requestData, requestConfig));
      return data;
    },
    async genericApiGetCall(url, params = {}) {
      const baseRequestConfig = this._makeRequestConfig();
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
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
      userCount = 0, pageSize = this.usersPageSize(),
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
      userCount = 0, pageSize = this.usersPageSize(),
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
      page = 1, type,
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
        } = await this.genericApiGetCall(url,
          params);
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
      const { data } = await axios.get(url, requestConfig);
      return data;
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

      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
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
      await axios.delete(url, requestConfig);
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

      const { data } = await axios.patch(url, requestData, requestConfig);
      return data;
    },
    /**
     * Searches for records in a module based on the provided criteria.
     *
     * @param {string} module the Zoho CRM module where the search for records will be performed.
     * @param {string} criteria the search will be performed using this `criteria`, it must match
     * the following pattern: `(({api_name}:{starts_with|equals}:{value})and/or({api_name}
     * :{starts_with|equals}:{value}))`. Example: `((Last_Name:equals:Burns%5C%2CB)and(First_Name:
     * starts_with:M))`
     * @param {integer} maxItems The max number of module records to return.
     * @param {boolean} converted flag that determines whether converted records should be
     * retrieved.
     * `true` - get only converted records. `false` - get only non-converted records.
     * `both` -  get all records.
     * @param {boolean} approved flag that determines whether approved records should be retrieved.
     * `true` - get only approved records. `false` - get only non-approved records.
     * `both` - get all records.
     * @returns {array} an array with the results of the records found.
     * Exact structure depends on the module being returned.
     */
    async *searchRecords(module, criteria, maxItems, converted, approved) {
      const url = `${this._apiUrl()}/${module}/search`;
      let currentPage = 1;
      do {
        const params = {
          criteria,
          converted,
          approved,
          per_page: Math.min(maxItems, 200),
          page: currentPage,
        };
        const requestConfig = {
          ...this._makeRequestConfig(),
          params,
        };
        const { data: searchResult }  = await this._withRetries(() =>
          axios.get(url, requestConfig));
        const hasResults = get(searchResult, [
          "data",
          "length",
        ]);
        if (!hasResults) {
          return;
        }
        for (const result of searchResult.data) {
          yield result;
        }
        maxItems -= searchResult.data.length;
        currentPage += 1;
      } while (maxItems > 0);
    },
    /**
     * Updates an existing record in the specified module.
     *
     * @param {string} module the Zoho CRM module where the record will be updated.
     * @param {object} recordId unique identifier of the record to update.
     * @param {object} record the record data. this object's structure must match the structure for
     * records in the specified module.
     * @param {array} trigger the triggers, workflow actions, related to this record to be
     * executed when the record is updated. Use an empty array `[]` to not execute any of the
     * workflows.
     * @returns {data: array} a one element array with the results of the update record operation.
     * Exact structure depends on the module being returned.
     */
    async updateModuleRecord(module, recordId, record, trigger) {
      const url = `${this._apiUrl()}/${module}/${recordId}`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        data: [
          record,
        ],
        trigger,
      };
      const { data } = await this._withRetries(() =>
        axios.put(url, requestData, requestConfig));
      return data;
    },
    /**
     * Updates the relation between records from different modules.
     *
     * @param {string} module the Zoho CRM module where the record will be created.
     * @param {object} recordId unique identifier of the record to relate.
     * @param {string} relatedModule the Zoho CRM module where the records related to the
     * specified `recordId` are located.
     * @param {array} relatedData an array with the unique identifier of the record (`id` in the
     *  related module, and its member estatus (`Member_Status`).
     * @returns {data: array} an array with the results of the `update related records` operation.
     * See the API docs for a sample response:
     * https://www.zoho.com/crm/developer/docs/api/v2/update-related-records.html
     */
    async updateRelatedRecords(module, recordId, relatedModule, relatedData) {
      const url = `${this._apiUrl()}/${module}/${recordId}/${relatedModule}`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        data: relatedData,
      };
      const { data } = await this._withRetries(() =>
        axios.put(url, requestData, requestConfig));
      return data;
    },
    /**
     * Creates or update a record. The fields' values specified in param
     * `duplicateCheckFields` are used to check for duplicate records.
     *
     * @param {string} module the Zoho CRM module where the record will be created or updated.
     * @param {object} record the record data. this object's structure must match the structure for
     *  the records in the specified module
     * @param {array} trigger the triggers, workflow actions, related to this record to be
     * executed when the record is created. Use an empty array `[]` to not execute any of the
     * workflows.
     * @returns {data: array} a one element array with the results of the create or
     * update record operation.
     * Exact structure depends on the module being returned.
     */
    async upsertRecord(module, record, trigger, duplicateCheckFields) {
      const url = `${this._apiUrl()}/${module}/upsert`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        data: [
          record,
        ],
        trigger,
        duplicate_check_fields: duplicateCheckFields,
      };
      const { data } = await this._withRetries(() =>
        axios.post(url, requestData, requestConfig));
      return data;
    },
  },
};
