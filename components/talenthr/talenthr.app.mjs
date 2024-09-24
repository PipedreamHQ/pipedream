import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "talenthr",
  propDefinitions: {
    jobPosition: {
      type: "string",
      label: "Job Position",
      description: "The job position for which the application has been submitted",
      async options() {
        const positions = await this.getJobPositions();
        return positions.map((position) => ({
          label: position.title,
          value: position.id,
        }));
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The ID of the employee",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new employee",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the new employee",
    },
    dataFields: {
      type: "object",
      label: "Data Fields",
      description: "The data fields to be updated for the employee",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the time off request",
    },
    responseStatus: {
      type: "string",
      label: "Response Status",
      description: "The response status for the time off request",
      options: [
        "approved",
        "pending",
        "declined",
      ],
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.talenthr.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getJobPositions(opts = {}) {
      return this._makeRequest({
        path: "/job-positions",
        ...opts,
      });
    },
    async listNewEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    async listNewJobApplications(opts = {}) {
      const {
        jobPosition, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: jobPosition
          ? `/job-applications?jobPosition=${jobPosition}`
          : "/job-applications",
        ...otherOpts,
      });
    },
    async createEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data: {
          name: this.name,
          role: this.role,
        },
        ...opts,
      });
    },
    async updateEmployee(opts = {}) {
      const {
        employeeId, dataFields, ...restOpts
      } = opts;
      return this._makeRequest({
        method: "PUT",
        path: `/employees/${employeeId}`,
        data: dataFields,
        ...restOpts,
      });
    },
    async respondToTimeOffRequest(opts = {}) {
      const {
        requestId, responseStatus, ...restOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/time-off-requests/${requestId}/respond`,
        data: {
          status: responseStatus,
        },
        ...restOpts,
      });
    },
  },
};
