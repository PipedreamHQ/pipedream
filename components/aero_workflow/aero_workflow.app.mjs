import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "aero_workflow",
  propDefinitions: {
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Team member whom the task will be assigned to",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getTeamMembers,
          resourceKey: "teamMemberNameReads",
          labelVal: {
            value: "name",
          },
        });
      },
    },
    aeroType: {
      type: "string",
      label: "Aero Type",
      description: "Aero type",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getAeroTypes,
          resourceKey: "aeroTypeReads",
          labelVal: {
            value: "name",
          },
        });
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Contact",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getContacts,
          resourceKey: "contacts",
          labelVal: {
            value: "name",
          },
        });
      },
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company",
      async options({ returnId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getCompanies,
          resourceKey: "companies",
          labelVal: {
            value: returnId
              ? "id"
              : "name",
          },
        });
      },
    },
    project: {
      type: "string",
      label: "Project",
      description: "Project",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getProjects,
          resourceKey: "projectReads",
          labelVal: {
            value: "name",
          },
        });
      },
    },
    hat: {
      type: "string",
      label: "Hat",
      description: "Hat",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getHats,
          resourceKey: "hatReads",
          labelVal: {
            value: "name",
          },
        });
      },
    },
    scheduledStartDate: {
      type: "string",
      label: "Scheduled Start Date",
      description: "Scheduled start date. Must be in ISO format, e.g. `2023-03-30T11:35:07.983Z`",
    },
    scheduledTotalHours: {
      type: "integer",
      label: "Scheduled Total Hours",
      description: "Scheduled total hours, max `24`",
    },
    scheduledHours: {
      type: "integer",
      label: "Scheduled  Hours",
      description: "Scheduled  hours, max `23`",
    },
    scheduledMinutes: {
      type: "integer",
      label: "Scheduled Minutes",
      description: "Scheduled minutes, max `59`",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority",
      options: [
        "elevated",
        "critical",
        "normal",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date. Must be in ISO format, e.g. `2023-03-30T11:35:07.983Z`",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status",
      options: [
        "inprogress",
        "notstarted",
        "canceled",
        "completed",
      ],
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Is billable",
      optional: true,
    },
    fixedFee: {
      type: "boolean",
      label: "Fixed Fee",
      description: "Is fixed fee",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.aeroworkflow.com/api/${this.$auth.account_number}/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "apikey": this.$auth.api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getTeamMembers(args = {}) {
      return this._makeRequest({
        path: "/TeamMembers",
        ...args,
      });
    },
    async getAeroTypes(args = {}) {
      return this._makeRequest({
        path: "/AeroTypes",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/Contacts",
        ...args,
      });
    },
    async getCompanies(args = {}) {
      return this._makeRequest({
        path: "/Companies",
        ...args,
      });
    },
    async getCompany({
      companyId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/Companies/${companyId}`,
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/Projects",
        ...args,
      });
    },
    async getHats(args = {}) {
      return this._makeRequest({
        path: "/Hats",
        ...args,
      });
    },
    async findCompany(args = {}) {
      return this._makeRequest({
        path: "/Companies/Query",
        ...args,
      });
    },
    async createCompany(args = {}) {
      return this._makeRequest({
        path: "/Companies",
        method: "POST",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/Contacts",
        method: "POST",
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/AeroTasks",
        method: "POST",
        ...args,
      });
    },
    async createEmail(args = {}) {
      return this._makeRequest({
        path: "/AeroEmails",
        method: "POST",
        ...args,
      });
    },
    async createAppointment(args = {}) {
      return this._makeRequest({
        path: "/AeroAppointments",
        method: "POST",
        ...args,
      });
    },
    async createVaultEntry({
      companyId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/Companies/${companyId}/VaultEntries`,
        method: "POST",
        ...args,
      });
    },
  },
};
