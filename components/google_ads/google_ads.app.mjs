import { axios } from "@pipedream/platform";

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
  },
  methods: {
    _baseUrl() {
      return "https://eolid4dq1k0t9hi.m.pipedream.net";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, ...opts
    }) {
      const googleAdsRequest = {
        headers: this._headers(),
        ...opts,
      };
      return axios($, {
        url: this._baseUrl(),
        data: googleAdsRequest,
      });
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
