import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "zoho_creator",
  propDefinitions: {},
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
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
    _apiUrl() {
      return `https://creator.${this.$auth.base_api_uri}/api/v2`;
    },
    _apiUsername() {
      return this.$auth.oauth_uid;
    },
    _applicationsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/applications`;
    },
    _reportsUrl(appLinkName) {
      const baseUrl = this._apiUrl();
      const username = this._apiUsername();
      return `${baseUrl}/${username}/${appLinkName}/reports`;
    },
    _reportDetailsUrl(appLinkName, reportLinkName) {
      const baseUrl = this._apiUrl();
      const username = this._apiUsername();
      return `${baseUrl}/${username}/${appLinkName}/report/${reportLinkName}`;
    },
    async genericApiGetCall(url, params = {}) {
      const baseRequestConfig = this._makeRequestConfig();
      const requestConfig = {
        ...baseRequestConfig,
        params,
        url,
      };
      return await axios(this, requestConfig);
    },
    async getApplications() {
      const url = this._applicationsUrl();
      const { applications } = await this.genericApiGetCall(url);
      return applications;
    },
    async getReports() {
      const applications = await this.getApplications();
      const reports = [];
      for (const app of applications) {
        const url = this._reportsUrl(app.link_name);
        const appReports = await this.genericApiGetCall(url);
        appReports.reports.forEach((report) => {
          report.app_link_name = app.link_name;
          reports.push(report);
        });
      }
      return reports;
    },
    async getLatestReportRow(report) {
      const url = this._reportDetailsUrl(report.app_link_name, report.link_name);
      const params = {
        limit: 1,
      };
      try {
        const { data } = await this.genericApiGetCall(url, params);
        return data[0];
      } catch (e) {
        // Can be ignored, 404 is returned if report doesn't have any records
        return null;
      }
    },
    getReportKey(report) {
      return `${this._apiUsername()}:${report.app_link_name}:${report.link_name}`;
    },
  },
};
