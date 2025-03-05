import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hr_cloud",
  propDefinitions: {
    apiVersion: {
      type: "string",
      label: "API Version",
      description: "The HR Cloud API version to use. Leave empty to use the default version.",
      default: "",
      optional: true,
    },
    departmentId: {
      type: "string",
      label: "Department",
      description: "The department to filter by",
      async options({ page }) {
        const departments = await this.getDepartments({
          params: {
            page: page + 1,
          },
        });
        return departments.map((department) => ({
          label: department.name,
          value: department.id,
        }));
      },
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title to filter by",
      async options({ page }) {
        const jobTitles = await this.getJobTitles({
          params: {
            page: page + 1,
          },
        });
        return jobTitles.map((jobTitle) => ({
          label: jobTitle.name,
          value: jobTitle.id,
        }));
      },
      optional: true,
    },
    leaveType: {
      type: "string",
      label: "Leave Type",
      description: "The leave type to filter by",
      async options() {
        const leaveTypes = await this.getLeaveTypes();
        return leaveTypes.map((leaveType) => ({
          label: leaveType.name,
          value: leaveType.id,
        }));
      },
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The project to filter by",
      async options({ page }) {
        const projects = await this.getProjects({
          params: {
            page: page + 1,
          },
        });
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
      optional: true,
    },
    employeeId: {
      type: "string",
      label: "Employee",
      description: "The employee",
      async options({ page }) {
        const employees = await this.getEmployees({
          params: {
            page: page + 1,
          },
        });
        return employees.map((employee) => ({
          label: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
      },
    },
    leaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "The ID of the leave request to approve",
      async options({ page }) {
        const leaveRequests = await this.getLeaveRequests({
          params: {
            page: page + 1,
            status: "pending",
          },
        });
        return leaveRequests.map((request) => ({
          label: `${request.employee_name} - ${request.leave_type} (${request.start_date} to ${request.end_date})`,
          value: request.id,
        }));
      },
    },
    hours: {
      type: "integer",
      label: "Hours Worked",
      description: "The number of hours worked",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the timesheet entry (YYYY-MM-DD)",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes for the timesheet entry",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The employee's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The employee's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The employee's email address",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The employee's start date (YYYY-MM-DD)",
      optional: true,
    },
    approvalNote: {
      type: "string",
      label: "Approval Note",
      description: "Note to include with the leave request approval",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      // Default to base URL without version
      const baseUrl = "https://api.hrcloud.com";

      // If a version is specified in the app props, use it
      if (this.$auth.apiVersion) {
        return `${baseUrl}/${this.$auth.apiVersion}`;
      }

      return baseUrl;
    },
    _authHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      params = {},
      data = {},
    }) {
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._authHeaders(),
        params,
        data,
      };

      try {
        console.log(`Making request to: ${config.url}`);
        const response = await axios($, config);
        return response;
      } catch (error) {
        console.error(`Error with request to ${path}: ${error.message}`);
        if (error.response?.status === 404) {
          throw new Error(`API endpoint not found (404): ${path}. Please verify the API URL structure in the HR Cloud documentation.`);
        }
        throw error;
      }
    },
    async createWebhook({
      eventType, endpoint, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/webhooks",
        data: {
          event_type: eventType,
          endpoint,
          metadata,
        },
      });
    },
    async deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/webhooks/${webhookId}`,
      });
    },
    async getEmployees(args = {}) {
      const response = await this._makeRequest({
        path: "/api/employees",
        ...args,
      });
      return response.employees || [];
    },
    async getEmployee(employeeId, args = {}) {
      const response = await this._makeRequest({
        path: `/api/employees/${employeeId}`,
        ...args,
      });
      return response.employee;
    },
    async createEmployee(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/employees",
        ...args,
      });
    },
    async getDepartments(args = {}) {
      const response = await this._makeRequest({
        path: "/api/departments",
        ...args,
      });
      return response.departments || [];
    },
    async getJobTitles(args = {}) {
      const response = await this._makeRequest({
        path: "/api/job-titles",
        ...args,
      });
      return response.job_titles || [];
    },
    async getLeaveRequests(args = {}) {
      const response = await this._makeRequest({
        path: "/api/leave-requests",
        ...args,
      });
      return response.leave_requests || [];
    },
    async getLeaveTypes(args = {}) {
      const response = await this._makeRequest({
        path: "/api/leave-types",
        ...args,
      });
      return response.leave_types || [];
    },
    async approveLeaveRequest(requestId, args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/api/leave-requests/${requestId}/approve`,
        ...args,
      });
    },
    async getProjects(args = {}) {
      const response = await this._makeRequest({
        path: "/api/projects",
        ...args,
      });
      return response.projects || [];
    },
    async getTimesheetEntries(args = {}) {
      const response = await this._makeRequest({
        path: "/api/timesheet-entries",
        ...args,
      });
      return response.timesheet_entries || [];
    },
    async createTimesheetEntry(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/timesheet-entries",
        ...args,
      });
    },
  },
};
