import { google } from "googleapis";
import { axios } from "@pipedream/platform";

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
      description: "Account ID to retrieve goals for. Can either be a specific **account ID** or `~all`, which refers to all the accounts that user has access to",
      async options({ token }) {
        return (await this.listAccounts(token)).items.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    webPropertyId: {
      type: "string",
      label: "Web Property ID",
      description: "Web property ID to retrieve goals for. Can either be a specific **web property ID** or `~all`, which refers to all the web properties that user has access to",
      async options({
        token, accountId,
      }) {
        return (await this.listWebProperties(token, accountId)).items.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "View (Profile) ID to retrieve goals for. Can either be a specific *view (profile) ID** or `~all`, which refers to all the views (profiles) that user has access to",
      async options({
        token, accountId, webPropertyId,
      }) {
        return (await this.listProfiles(token, accountId, webPropertyId)).items.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    goalId: {
      type: "string",
      label: "Goal ID",
      description: "Goal ID to retrieve the goal for",
      async options({
        token, accountId, webPropertyId, profileId,
      }) {
        return (await this.listGoals(token, {
          accountId,
          webPropertyId,
          profileId,
        })).items.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
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
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      opts.headers["Content-Type"] = "application/json";
      if (!opts.method) opts.method = "post";
      opts.url = "https://www.google-analytics.com/mp/collect";
      try {
        return await axios(this, opts);
      } catch (err) {
        this._throwFormattedError(err);
      }
    },
    _throwFormattedError(err) {
      err = err.response.data;
      throw Error(`${err.statusCode} - ${err.statusMessage} - ${err.message}`);
    },
    async listAccounts(token) {
      return (await this._getAnalyticsInstance(token).management.accounts.list()).data;
    },
    async listWebProperties(token, accountId) {
      return (await this._getAnalyticsInstance(token).management.webproperties.list({
        accountId,
      })).data;
    },
    async listProfiles(token, accountId, webPropertyId) {
      return (await this._getAnalyticsInstance(token).management.profiles.list({
        accountId,
        webPropertyId,
      })).data;
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
    async createMeasurement(params, data) {
      await this._makeRequest({
        params,
        data,
      });
    },
  },
};
