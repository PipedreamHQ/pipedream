import { axios } from "@pipedream/platform";
import { QUERIES } from "./common/queries.mjs";

export default {
  type: "app",
  app: "google_ads",
  propDefinitions: {
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email address of the contact to add to the customer list.",
    },
    userListId: {
      type: "string",
      label: "User List ID",
      description: "The ID of the user list to add the contact to.",
      async options() {
        const { results = [] } = await this.listLists();

        return results.map(({
          userList: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Use Google Ads As",
      description: "Select an account from the list of [customers directly accessible by the authenticated user](https://developers.google.com/google-ads/api/rest/reference/rest/v16/customers/listAccessibleCustomers). This is usually a **manager account**, used as `login-customer-id`",
      async options() {
        const response = await this.listAccessibleCustomers();
        return response?.map(((resourceName) => ({
          label: resourceName,
          value: resourceName.split("/").pop(),
        })));
      },
    },
    customerClientId: {
      type: "string",
      label: "Customer Client ID",
      description: "Select a [customer client](https://developers.google.com/google-ads/api/reference/rpc/v16/CustomerClient) from the list of [customers linked to the selected account](https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy).",
      useQuery: true,
      async options({
        accountId, query,
      }) {
        const response = await this.listCustomerClients({
          accountId,
          query,
        });
        return response?.map(({
          customerClient: {
            descriptiveName, id, manager,
          },
        } ) => ({
          label: `${manager
            ? "[Manager] "
            : ""}${descriptiveName}`,
          value: id,
        }));
      },
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description:
        "Additional fields and values for the customer list. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList) for available fields. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://eolid4dq1k0t9hi.m.pipedream.net";
    },
    _headers(accountId) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "login-customer-id": accountId,
      };
    },
    _makeRequest({
      $ = this, accountId, ...opts
    }) {
      const data = {
        headers: this._headers(accountId),
        ...opts,
      };
      return axios($, {
        method: "post",
        url: this._baseUrl(),
        data,
      });
    },
    async listAccessibleCustomers() {
      const response = await this._makeRequest({
        path: "/v16/customers:listAccessibleCustomers",
      });
      return response.resourceNames;
    },
    async listCustomerClients({
      accountId, query,
    }) {
      const response = await this._makeRequest({
        path: `/v16/customers/${accountId}/googleAds:search`,
        method: "post",
        data: {
          query: QUERIES.listCustomerClients(query),
        },
      });
      return response.results;
    },
    async createUserList({
      customerClientId, ...args
    }) {
      const response = await this._makeRequest({
        path: `v16/customers/${customerClientId}/userLists:mutate`,
        method: "post",
        ...args,
      });
      return response;
    },
    async createConversionAction({
      customerClientId, ...args
    }) {
      const response = await this._makeRequest({
        path: `v16/customers/${customerClientId}/conversionActions:mutate`,
        method: "post",
        ...args,
      });
      return response;
    },
    addContactToCustomerList({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v15/${path}:addOperations`,
        ...opts,
      });
    },
    createOfflineUserDataJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/v15/customers/${this.$auth.login_customer_id}/offlineUserDataJobs:create`,
        ...opts,
      });
    },
    runOfflineUserDataJob({ path }) {
      return this._makeRequest({
        method: "POST",
        path: `/v15/${path}:run`,
      });
    },
    listLists() {
      return this._makeRequest({
        method: "POST",
        path: `/v15/customers/${this.$auth.login_customer_id}/googleAds:search`,
        data: {
          query: `SELECT
            user_list.id,
            user_list.name
            FROM user_list`,
        },
      });
    },
  },
};
