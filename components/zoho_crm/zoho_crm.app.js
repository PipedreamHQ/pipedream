const axios = require("axios");
const retry = require("async-retry");
const get = require("lodash/get");

module.exports = {
  type: "app",
  app: "zoho_crm",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Location",
      description:
        "The domain location of your account. The Zoho API domain URL depends on the location of Zoho CRM data center associated to your account.",
      default: "com",
      options: [
        {
          label: "US",
          value: "com",
        },
        {
          label: "AU",
          value: "com.au",
        },
        {
          label: "EU",
          value: "eu",
        },
        {
          label: "IN",
          value: "in",
        },
        {
          label: "CN",
          value: "com.cn",
        },
      ],
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl(domain = "com") {
      return `https://www.zohoapis.${domain}/crm/v2`;
    },
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    _leadsUrl(domain) {
      const baseUrl = this._apiUrl(domain);
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
     * Converts a lead into a contact or an account.
     *
     * @param {string} domain the domain location of the connected Zoho CRM
     * account. The Zoho API domain URL depends on the location of Zoho CRM data
     * center associated to the connected account.
     * @param {string} recordId unique identifier of the record associated to the Lead to convert.
     * @param {object} opts optional parameters for this function
     * @param {boolean} opts.overwrite specifies if the lead details must be overwritten in
     * the Contact/Account/Deal based on lead conversion mapping configuration.
     * @param {boolean} opts.notify_lead_owner specifies whether the lead owner must get
     *  notified about the lead conversion via email.
     * @param {boolean} opts.notify_new_entity_owner specifies whether the user to whom
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
     * @returns The users API page number where new records would be contained
     */
    async addTags(domain, module, recordId, tagNames, overWrite) {
      const baseUrl = this._apiUrl(domain);
      const url = `${baseUrl}/${module}/actions/add_tags`;
      const requestConfig = {
        url,
        method: "POST",
        headers: this._makeRequestConfig().headers,
        params: {
          ids: recordId,
          tag_names: tagNames.join(","),
          over_write: overWrite,
        },
      };
      const { data } = await this._withRetries(() =>
        axios(requestConfig));
      return data;
    },
    /**
     * Converts a lead into a contact or an account.
     *
     * @param {string} domain the domain location of the connected Zoho CRM
     * account. The Zoho API domain URL depends on the location of Zoho CRM data
     * center associated to the connected account.
     * @param {string} recordId unique identifier of the record associated to the Lead to convert.
     * @param {object} opts optional parameters for this function
     * @param {boolean} opts.overwrite specifies if the lead details must be overwritten in
     * the Contact/Account/Deal based on lead conversion mapping configuration.
     * @param {boolean} opts.notify_lead_owner specifies whether the lead owner must get
     *  notified about the lead conversion via email.
     * @param {boolean} opts.notify_new_entity_owner specifies whether the user to whom
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
     * @returns The users API page number where new records would be contained
     */
    async convertLead(domain, recordId, opts) {
      const url = `${this._leadsUrl(domain)}/${recordId}/actions/convert`;
      const requestConfig = this._makeRequestConfig();
      const requestData = {};
      requestData.data = opts;
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
  },
};
