import analyticsreporting from "@googleapis/analyticsreporting";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_analytics",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      description: "The Google Analytics account ID to list properties from.",
      async options() {
        const response = await this.listAccounts();
        return response?.accounts?.map((account) => ({
          label: account.displayName,
          value: account.name,
        }));
      },
    },
    viewId: {
      type: "string",
      label: "View Id",
      description: "ID of the view to monitor. Can be found on your Google Analytics Dashboard -> Admin -> View Setting",
    },
  },
  methods: {
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo.toISOString().split("T")[0];
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this._accessToken()}`,
        ...headers,
      };
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    async queryReportsGA4(args = {}) {
      return this.makeRequest({
        url: `https://analyticsdata.googleapis.com/v1beta/properties/${args.property}:runReport`,
        method: "POST",
        ...args,
      });
    },
    async listAccounts() {
      return this.makeRequest({
        url: "https://analyticsadmin.googleapis.com/v1beta/accounts",
      });
    },
    async createProperty(args) {
      return this.makeRequest({
        url: "https://analyticsadmin.googleapis.com/v1beta/properties",
        method: "POST",
        ...args,
      });
    },
    client() {
      const auth = new analyticsreporting.auth.OAuth2();
      auth.setCredentials({
        access_token: this._accessToken(),
      });
      return analyticsreporting.analyticsreporting({
        version: "v4",
        auth,
      });
    },
    async queryReports(data) {
      const client = this.client();
      return client.reports.batchGet(data);
    },
  },
};
