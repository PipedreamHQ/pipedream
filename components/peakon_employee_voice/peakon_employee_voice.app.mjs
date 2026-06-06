import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peakon_employee_voice",
  propDefinitions: {
    contextId: {
      type: "string",
      label: "Context ID",
      description:
        "Optional segment or context ID to scope analytics to a specific population "
        + "(e.g. `segment_62704631`). Use **List Segments** to discover available contextIds.",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Time interval for analytics data. Defaults to `quarter`.",
      options: [
        "month",
        "quarter",
        "year",
        "all",
        "recent",
      ],
      optional: true,
      default: "quarter",
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description:
        "Internal Peakon employee ID (e.g. `80166956`). "
        + "Use **List Employees** to find the ID by searching by name.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.${this.$auth.environment}.com`;
    },
    async _makeRequest({
      $, path, method = "GET", params, data,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
        data,
      });
    },
    listSegments({
      $,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/api/v1/segments",
        params,
      });
    },
    listEmployees({
      $,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/api/v1/employees",
        params,
      });
    },
    createEmployee({
      $,
      attributes,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/v1/employees",
        data: {
          data: {
            type: "employees",
            attributes,
          },
        },
      });
    },
    updateEmployee({
      $,
      employeeId,
      attributes,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `/api/v1/employees/${employeeId}`,
        data: {
          data: {
            type: "employees",
            id: employeeId,
            attributes,
          },
        },
      });
    },
    deleteEmployee({
      $,
      employeeId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/api/v1/employees/${employeeId}`,
      });
    },
    getEngagementOverview({
      $,
      contextId,
      params,
    }) {
      return this._makeRequest({
        $,
        path: `/api/v1/engagement/contexts/${contextId}/overview`,
        params,
      });
    },
    getDriverScores({
      $,
      contextId,
      params,
    }) {
      return this._makeRequest({
        $,
        path: `/api/v1/engagement/contexts/${contextId}/drivers`,
        params,
      });
    },
  },
};
