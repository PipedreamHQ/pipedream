import analyticsreporting from "@googleapis/analyticsreporting";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_analytics",
  propDefinitions: {
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
    getUrl(path) {
      return `https://analyticsdata.googleapis.com${path}`;
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
        path,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...otherConfig,
      };
      return axios($, config);
    },
    async queryReportsGA4(args = {}) {
      return this.makeRequest({
        path: `/v1beta/properties/${args.property}:runReport`,
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
