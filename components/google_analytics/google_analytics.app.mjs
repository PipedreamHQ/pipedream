import analyticsreporting from "@googleapis/analyticsreporting";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
    _accessToken() {
      return this.$auth.oauth_access_token;
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
    queryReports(data) {
      const client = this.client();
      return client.reports.batchGet(data);
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this._accessToken()}`,
        ...headers,
      };
    },
    getUrl(path, api = constants.API.ADMIN) {
      return `${api.BASE_URL}${api.VERSION_PATH}${path}`;
    },
    makeRequest({
      $ = this, path, headers, api, ...args
    } = {}) {
      const config = {
        url: this.getUrl(path, api),
        headers: this.getHeaders(headers),
        ...args,
      };
      return axios($, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    createProperty(args) {
      return this.post({
        path: "/properties",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    queryReportsGA4({
      property, ...args
    } = {}) {
      return this.post({
        api: constants.API.DATA,
        path: `/properties/${property}:runReport`,
        ...args,
      });
    },
  },
};
