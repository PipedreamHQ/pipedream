import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hr_cloud",
  propDefinitions: {
    departmentId: {
      type: "string",
      label: "Department",
      description: "The employee department",
      async options({ page }) {
        const departments = await this.getDepartments({
          params: {
            page: page + 1,
          },
        }); console.log(departments);
        return departments.map((department) => ({
          label: department.xDepartmentName,
          value: department.Id,
        }));
      },
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
          label: jobTitle.xPositionTitle,
          value: jobTitle.Id,
        }));
      },
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
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of a location",
      async options({ page }) {
        const locations = await this.getLocations({
          params: {
            page: page + 1,
          },
        });
        return locations.map((location) => ({
          label: location.xLocationName,
          value: location.Id,
        }));
      },
    },
    employmentStatusId: {
      type: "string",
      label: "Employment Status ID",
      description: "The ID of an employment status",
      async options({ page }) {
        const statuses = await this.getEmploymentStatus({
          params: {
            page: page + 1,
          },
        });
        return statuses.map((status) => ({
          label: status.xType,
          value: status.Id,
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
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "Unique employee number",
    },
    recordStatus: {
      type: "string",
      label: "Record Status",
      description: "The employee status",
      options: [
        "Active",
        "Inactive",
      ],
      default: "Active",
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
      return "https://corehr-api.hrcloud.com/v1/cloud";
    },
    _authHeaders() {
      return {
        "customer_key": `${this.$auth.consumer_key}`,
        "customer_secret": `${this.$auth.consumer_secret}`,
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
        path: "/webhooks",
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
        path: `/webhooks/${webhookId}`,
      });
    },
    async getEmployees(args = {}) {
      const response = await this._makeRequest({
        path: "/employees",
        ...args,
      });
      return response.employees || [];
    },
    async getEmployee(employeeId, args = {}) {
      const response = await this._makeRequest({
        path: `/employees/${employeeId}`,
        ...args,
      });
      return response.employee;
    },
    async createEmployee(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/xEmployee",
        ...args,
      });
    },
    async getDepartments(args = {}) {
      return this._makeRequest({
        path: "/xDepartment",
        ...args,
      });
    },
    async getJobTitles(args = {}) {
      return this._makeRequest({
        path: "/xPosition",
        ...args,
      });
    },
    async getLeaveRequests(args = {}) {
      const response = await this._makeRequest({
        path: "/leave-requests",
        ...args,
      });
      return response.leave_requests || [];
    },
    async getLeaveTypes(args = {}) {
      const response = await this._makeRequest({
        path: "/leave-types",
        ...args,
      });
      return response.leave_types || [];
    },
    async getLocations(args = {}) {
      return this._makeRequest({
        path: "/xLocation",
        ...args,
      });
    },
    async getEmploymentStatus(args = {}) {
      return this._makeRequest({
        path: "/xEmploymentStatus",
        ...args,
      });
    },
    async approveLeaveRequest(requestId, args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/leave-requests/${requestId}/approve`,
        ...args,
      });
    },
    async getProjects(args = {}) {
      const response = await this._makeRequest({
        path: "/projects",
        ...args,
      });
      return response.projects || [];
    },
    async getTimesheetEntries(args = {}) {
      const response = await this._makeRequest({
        path: "/timesheet-entries",
        ...args,
      });
      return response.timesheet_entries || [];
    },
    async createTimesheetEntry(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/timesheet-entries",
        ...args,
      });
    },
  },
};
