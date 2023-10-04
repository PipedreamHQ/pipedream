import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jibble",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person to retrieve.",
      async options() {
        const res = await this.listPersons();
        return res.value.map((person) => ({
          label: person.fullName,
          value: person.id,
        }));
      },
    },
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The ID of the activity to retrieve.",
      async options() {
        const res = await this.listActivities();
        return res.value.map((activity) => ({
          label: activity.name,
          value: activity.id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to retrieve.",
      async options() {
        const res = await this.listProjects();
        return res.value.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
  },
  methods: {
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getTimeTrackingBaseUrl() {
      return "https://time-tracking.prod.jibble.io/v1";
    },
    _getWorkspaceBaseUrl() {
      return "https://workspace.prod.jibble.io/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this._getAccessToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async listPersons(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/People`,
        method: "GET",
      }, ctx);
    },
    async listActivities(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Activities`,
        method: "GET",
      }, ctx);
    },
    async listProjects(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Projects`,
        method: "GET",
      }, ctx);
    },
    async clockIn(data, ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getTimeTrackingBaseUrl()}/TimeEntries`,
        method: "POST",
        data,
      }, ctx);
    },
  },
};
