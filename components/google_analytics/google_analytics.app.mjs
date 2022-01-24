import { google } from "googleapis";

export default {
  type: "app",
  app: "google_analytics",
  propDefinitions: {
    google,
    token: {
      type: "string",
      label: "Authentication Token",
      description: "Authentication Token",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Account ID to retrieve goals for",
    },
    webPropertyId: {
      type: "string",
      label: "Web Property ID",
      description: "Web property ID to retrieve goals for",
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "View (Profile) ID to retrieve goals for",
    },
    goalId: {
      type: "string",
      label: "Goal ID",
      description: "Goal ID to retrieve the goal for",
    },
  },
  methods: {
    _auth(token = undefined) {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: token || this.$auth.oauth_access_token,
      });
      return auth;
    },
    _getAnalyticsInstance(token = undefined) {
      return new google.analytics({
        version: "v3",
        auth: this._auth(token),
      });
    },
    _getAnalyticsReportingInstance(token = undefined) {
      return new google.analyticsreporting({
        version: "v4",
        auth: this._auth(token),
      });
    },
    _getGoalsInstance(token) {
      return this._getAnalyticsInstance(token).management.goals;
    },
    _getReportsInstance(token) {
      return this._getAnalyticsReportingInstance(token).reports;
    },
    async listGoals(token, params) {
      return (await this._getGoalsInstance(token).list(params)).data;
    },
    async searchGoal(token, params) {
      return (await this._getGoalsInstance(token).get(params)).data;
    },
    async updateGoal(token, params) {
      return (await this._getGoalsInstance(token).patch(params)).data;
    },
    async listReports(token, params) {
      return (await this._getReportsInstance(token).batchGet(params)).data;
    },
  },
};
