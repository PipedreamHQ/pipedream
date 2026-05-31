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
  },
};
