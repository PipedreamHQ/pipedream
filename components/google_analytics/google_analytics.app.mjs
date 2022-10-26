import analyticsreporting from "@googleapis/analyticsreporting";

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
    async client() {
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
      const client = await this.client();
      return client.reports.batchGet(data);
    },
  },
};
