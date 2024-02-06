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
    clientId: {
      type: "string",
      label: "Client Id",
      description: "The Id of the client to retrieve.",
      async options() {
        const res = await this.listClients();
        return res.value.map((client) => ({
          label: client.name,
          value: client.id,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group to retrieve.",
      async options() {
        const res = await this.listGroups();
        return res.value.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location to retrieve.",
      async options() {
        const res = await this.listLocations();
        return res.value.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      },
    },
    scheduleId: {
      type: "string",
      label: "Schedule ID",
      description: "The ID of the schedule to retrieve.",
      async options() {
        const res = await this.listSchedules();
        return res.value.map((schedule) => ({
          label: schedule.name,
          value: schedule.id,
        }));
      },
    },
    clientType: {
      type: "string",
      label: "Client Type",
      description: "The client type. Ex: `Web`.",
    },
    clientVersion: {
      type: "string",
      label: "Client Version",
      description: "The client version. Ex: `web 3.0`.",
    },
    os: {
      type: "string",
      label: "OS",
      description: "The operating system. Ex: `Windows 10`.",
    },
    deviceModel: {
      type: "string",
      label: "Device Model",
      description: "The device model. Ex: `MacbookPro`.",
    },
    deviceName: {
      type: "string",
      label: "Device Name",
      description: "The device name. Ex: `TestLaptop`.",
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location.",
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
    _getTimeAttendanceBaseUrl() {
      return "https://time-attendance.prod.jibble.io/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this._getAccessToken()}`,
        "Token": `Bearer ${this._getAccessToken()}`,
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
    async listClients(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Clients`,
        method: "GET",
      }, ctx);
    },
    async listGroups(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Groups`,
        method: "GET",
      }, ctx);
    },
    async listLocations(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Locations`,
        method: "GET",
      }, ctx);
    },
    async listSchedules(ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getWorkspaceBaseUrl()}/Schedules`,
        method: "GET",
      }, ctx);
    },
    async clockIn(data, ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getTimeTrackingBaseUrl()}/TimeEntries`,
        method: "POST",
        data: {
          ...data,
          type: "In",
        },
      }, ctx);
    },
    async clockOut(data, ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getTimeTrackingBaseUrl()}/TimeEntries`,
        method: "POST",
        data: {
          ...data,
          type: "Out",
        },
      }, ctx);
    },
    async createTimesheetsDailySummary(params, ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getTimeAttendanceBaseUrl()}/TimesheetsSummary`,
        method: "GET",
        params: {
          period: "Custom",
          ...params,
        },
      }, ctx);
    },
    async createTimeTrackingReport(params, ctx = this) {
      return this._makeHttpRequest({
        url: `${this._getTimeAttendanceBaseUrl()}/TrackedTimeReport`,
        method: "GET",
        params,
      }, ctx);
    },
  },
};
