import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peakon_employee_voice",
  propDefinitions: {
    contextId: {
      type: "string",
      label: "Context ID",
      description:
        "Company or segment context ID. Format: `company_[companyId]` for company-wide metrics "
        + "or `segment_[segmentId]` for a specific segment. "
        + "Use **List Segments** to discover available segment IDs.",
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
    observations: {
      type: "boolean",
      label: "Include Observations",
      description: "Whether to include the observations array in the response. Defaults to false.",
      optional: true,
      default: false,
    },
    participation: {
      type: "boolean",
      label: "Include Participation",
      description: "Whether to include participation data in the response. Defaults to false.",
      optional: true,
      default: false,
    },
    filterSegmentIds: {
      type: "string",
      label: "Filter by Segment IDs",
      description:
        "Comma-separated list of segment IDs to filter by segment membership. "
        + "Example: `1001,1002`. Use **List Segments** to discover available segment IDs.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Employee's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Employee's last name.",
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "HR employee number or unique identifier (e.g. `E001`). Must be unique across employees.",
    },
    employmentStatus: {
      type: "string",
      label: "Employment Status",
      description: "Current employment status (e.g. `employed`, `on_leave`).",
      optional: true,
    },
    customAttributes: {
      type: "string",
      label: "Custom Attributes",
      description:
        "JSON object of custom HR attributes for the employee. "
        + "Example: `{\"Department\": \"Sales\", \"Region\": \"North America\", \"Job Level\": \"Manager\"}`. "
        + "Enum values are accepted as plain strings.",
      optional: true,
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
