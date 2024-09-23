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
      label: "Customer List ID",
      description: "Select a Customer List to add the contact to, or provide a custom Customer List ID.",
      async options({
        accountId, customerClientId,
      }) {
        const response = await this.listUserLists({
          accountId,
          customerClientId,
        });
        return response?.map(({
          userList: {
            id, name,
          },
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Use Google Ads As",
      description: "Select an account from the list of [customers directly accessible by the authenticated user](https://developers.google.com/google-ads/api/rest/reference/rest/v16/customers/listAccessibleCustomers). This is usually a **Manager Account**, used as `login-customer-id`",
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
      label: "Managed Account",
      description: "Select a [customer client](https://developers.google.com/google-ads/api/reference/rpc/v16/CustomerClient) from the list of [customers linked to the selected account](https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy).",
      useQuery: true,
      optional: true,
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
        }) => ({
          label: `${manager
            ? "[Manager] "
            : ""}${descriptiveName}`,
          value: id,
        })).filter(({ value }) => value !== accountId);
      },
    },
    leadFormId: {
      type: "string",
      label: "Lead Form ID",
      description: "Select a [Lead Form](https://developers.google.com/google-ads/api/rest/reference/rest/v16/Asset#LeadFormAsset) to watch for new entries.",
      async options({
        accountId, customerClientId,
      }) {
        const response = await this.listLeadForms({
          accountId,
          customerClientId,
        });
        return response?.map(({
          asset: {
            id, leadFormAsset: {
              businessName, headline,
            },
          },
        }) => ({
          label: `${businessName} - ${headline}`,
          value: id,
        }));
      },
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
      $ = this, accountId, customerClientId, path, ...opts
    }) {
      const data = {
        headers: this._headers(accountId),
        path: path.replace("{customerClientId}", customerClientId ?? accountId),
        ...opts,
      };
      return axios($, {
        method: "post",
        url: this._baseUrl(),
        data,
      });
    },
    async search({
      query, ...args
    }) {
      console.log("Executing query: ", query);
      const response = await this._makeRequest({
        path: "/v16/customers/{customerClientId}/googleAds:search",
        method: "post",
        data: {
          query,
        },
        ...args,
      });
      return response;
    },
    async listAccessibleCustomers() {
      const response = await this._makeRequest({
        path: "/v16/customers:listAccessibleCustomers",
      });
      return response.resourceNames;
    },
    async listCustomerClients({
      query, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listCustomerClients(query),
        ...args,
      });
      return results;
    },
    async createReport(args) {
      const { results } = await this.search(args);
      return results;
    },
    async createUserList(args) {
      const response = await this._makeRequest({
        path: "v16/customers/{customerClientId}/userLists:mutate",
        method: "post",
        ...args,
      });
      return response;
    },
    async listUserLists(args) {
      const { results } = await this.search({
        query: QUERIES.listUserLists(),
        ...args,
      });
      return results;
    },
    async listConversionActions(args) {
      const { results } = await this.search({
        query: QUERIES.listConversionActions(),
        ...args,
      });
      return results;
    },
    async listRemarketingActions(args) {
      const { results } = await this.search({
        query: QUERIES.listRemarketingActions(),
        ...args,
      });
      return results;
    },
    async listLeadForms(args) {
      const { results } = await this.search({
        query: QUERIES.listLeadForms(),
        ...args,
      });
      return results;
    },
    async listCampaigns({
      query, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listCampaigns(query),
        ...args,
      });
      return results;
    },
    async listResources({
      resource, query, pageToken, ...args
    }) {
      return this.search({
        query: QUERIES.listResources(resource, query),
        params: {
          pageSize: 100,
          pageToken,
        },
        ...args,
      });
    },
    async getLeadFormData({
      leadFormId, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listLeadFormSubmissionData(leadFormId),
        ...args,
      });
      return results;
    },
    async createConversionAction(args) {
      const response = await this._makeRequest({
        path: "v16/customers/{customerClientId}/conversionActions:mutate",
        method: "post",
        ...args,
      });
      return response;
    },
    async addContactToCustomerList({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v16/${path}:addOperations`,
        ...opts,
      });
    },
    async createOfflineUserDataJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v16/customers/{customerClientId}/offlineUserDataJobs:create",
        ...opts,
      });
    },
    async runOfflineUserDataJob({
      path, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v16/${path}:run`,
        ...args,
      });
    },
  },
};
