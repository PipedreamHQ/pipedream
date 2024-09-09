import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deputy",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The identifier of a location",
      async options() {
        const locations = await this.listLocations();
        return locations?.map(({
          Id: value, CompanyName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The identifier of an employee",
      async options() {
        const employees = await this.listEmployees();
        return employees?.map(({
          Id: value, DisplayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.endpoint}/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resource/Webhook",
        ...opts,
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/supervise/employee",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/resource/Company",
        ...opts,
      });
    },
    createLocation(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/supervise/company",
        ...opts,
      });
    },
    startTimesheet(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/supervise/timesheet/start",
        ...opts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/supervise/employee",
        ...opts,
      });
    },
  },
};
