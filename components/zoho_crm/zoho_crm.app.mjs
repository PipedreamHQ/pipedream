//import axios from "axios";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_crm",
  propDefinitions: {
    lead: {
      type: "string",
      label: "Lead",
      description: "Unique identifier of the lead record to be converted",
      async options({ page }) {
        const { data: leads } = await this.listRecords("Leads", page);
        return leads.map((lead) => ({
          label: lead.Full_Name ?? lead.id,
          value: lead.id,
        }));
      },
    },
    account: {
      type: "string",
      label: "Account",
      description: "Use this key to associate an account with the lead being converted. Pass the unique and valid account ID.",
      async options({ page }) {
        const { data: accounts } = await this.listRecords("Accounts", page);
        return accounts.map((account) => ({
          label: account.Account_Name ?? account.id,
          value: account.id,
        }));
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Use this key to associate a contact with the lead being converted. Pass the unique and valid contact ID.",
      async options({ page }) {
        const { data: contacts } = await this.listRecords("Contacts", page);
        return contacts.map((contact) => ({
          label: contact.Full_Name ?? contact.id,
          value: contact.id,
        }));
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "Use this key to associate a contact with the lead being converted. Pass the unique and valid contact ID.",
      async options({ page }) {
        const { users } = await this.listRecords("users?type=ActiveUsers", page);
        return users.map((user) => ({
          label: user.full_name ?? user.id,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://www.zohoapis.com/crm/v2";
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
    _getAxiosParams(opts) {
      console.log({
        ...opts,
        url: `${this.$auth.api_domain}/crm/v2${opts.path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
        path: undefined,
      });
      return {
        ...opts,
        url: `https://www.zohoapis.com/crm/v2.1${opts.path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
        path: undefined,
      };
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
      const watch = data.watch[0];
      console.log(watch);
      console.log(watch.details);
      if (watch.status !== "success") {
        throw new Error(`${watch.message} ${JSON.stringify(watch.details)}`);
      }
      return data;
    },
    async listRecords(moduleType, page = 0, $) {
      return axios($ ?? this, this._getAxiosParams({
        path: `/${moduleType}`,
        data: {
          page: page + 1,
        },
      }));
    },
    async convertLead(lead, data, $) {
      return axios($ ?? this, this._getAxiosParams({
        method: "POST",
        path: `/Leads/${lead}/actions/convert`,
        data,
      }));
    },
  },
};
