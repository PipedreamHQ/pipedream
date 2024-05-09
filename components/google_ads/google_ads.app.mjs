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
    useGoogleAdsAs: {
      type: "string",
      label: "Use Google Ads As",
      description: "The Google Ads account to use",
      required: true,
    },
    managedAccount: {
      type: "string",
      label: "Managed Account",
      description: "The managed account, if applicable",
      optional: true,
    },
    leadForm: {
      type: "string",
      label: "Lead Form",
      description: "Select the lead form",
      required: true,
      async options({
        page, prevContext,
      }) {
        const {
          items, nextPageToken,
        } = await this.listLeadForms({
          page,
          prevContext,
        });
        return {
          options: items.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            nextPageToken,
          },
        };
      },
    },
    conversionUserIdentifier: {
      type: "string",
      label: "Conversion User Identifier",
      description: "The identifier for the user conversion",
      required: true,
    },
    conversionAction: {
      type: "string",
      label: "Conversion Action",
      description: "The conversion action",
      required: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the conversion",
      required: true,
    },
    consentForAdUserData: {
      type: "boolean",
      label: "Consent for Ad User Data",
      description: "Whether consent was obtained for the use of ad user data",
      optional: true,
    },
    consentForAdPersonalization: {
      type: "boolean",
      label: "Consent for Ad Personalization",
      description: "Whether consent was obtained for ad personalization",
      optional: true,
    },
    value: {
      type: "number",
      label: "Value",
      description: "The value of the conversion",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the conversion value",
      optional: true,
    },
    resource: {
      type: "string",
      label: "Resource",
      description: "The resource for the report",
      required: true,
    },
    dateRange: {
      type: "string",
      label: "Date Range",
      description: "The date range for the report",
      required: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer list",
      required: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the customer list",
      optional: true,
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
    // _baseUrl() {
    //   return "https://googleads.googleapis.com";
    // },
    // async _makeRequest(opts = {}) {
    //   const {
    //     $ = this, method = "GET", path, headers, ...otherOpts
    //   } = opts;
    //   return axios($, {
    //     ...otherOpts,
    //     method,
    //     url: this._baseUrl() + path,
    //     headers: {
    //       ...headers,
    //       "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
    //       "developer-token": `${this.$auth.developer_token}`,
    //       "login-customer-id": this.managedAccount
    //         ? `${this.managedAccount}`
    //         : `${this.$auth.login_customer_id}`,
    //     },
    //   });
    // },
    async listLeadForms({ page }) {
      return this._makeRequest({
        path: `/listLeadForms?page=${page}`,
      });
    },
    async createCampaign(args) {
    // Placeholder for creating a campaign
    // Replace with actual API request to create a campaign
      return this._makeRequest({
        method: "POST",
        path: "/v9/customers/{customer_id}/campaigns",
        ...args,
      });
    },
    async trackOfflineConversion(args) {
    // Placeholder for sending event to track offline conversion
    // Replace with actual API request to track offline conversion
      return this._makeRequest({
        method: "POST",
        path: "/v9/customers/{customer_id}/conversions:uploadClickConversions",
        ...args,
      });
    },
    async generateReport(args) {
    // Placeholder for generating a report
    // Replace with actual API request to generate a report
      return this._makeRequest({
        method: "POST",
        path: "/v9/customers/{customer_id}/googleAds:searchStream",
        ...args,
      });
    },
    async createCustomerList(args) {
    // Placeholder for creating a customer list
    // Replace with actual API request to create a customer list
      return this._makeRequest({
        method: "POST",
        path: "/v9/customers/{customer_id}/customerLists",
        ...args,
      });
    },
  },
};
