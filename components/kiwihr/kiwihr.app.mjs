import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kiwihr",
  propDefinitions: {
    department: {
      type: "string",
      label: "Department",
      description: "ID of the department to filter employees. Optional.",
      optional: true,
      async options() {
        const items = await this.getDepartments();
        return items.map((e) => ({
          value: e.id,
          label: e.name,
        }));
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "ID of the location to filter employees. Optional.",
      optional: true,
      async options() {
        const items = await this.getLocations();
        return items.map((e) => ({
          value: e.id,
          label: e.name,
        }));
      },
    },
    leaveType: {
      type: "string",
      label: "Leave Type",
      description: "Type of leave to filter requests. Optional.",
      optional: true,
      async options() {
        const items = await this.getLeaveTypes();
        return items.map((e) => ({
          value: e.id,
          label: e.name,
        }));
      },
    },
    requestStatus: {
      type: "string",
      label: "Request Status",
      description: "Status of the leave request to filter.",
      optional: true,
      async options() {
        return [
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "Approved",
            value: "approved",
          },
          {
            label: "Rejected",
            value: "rejected",
          },
        ];
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee to watch for updates.",
    },
    employeeName: {
      type: "string",
      label: "Employee Name",
      description: "Name of the employee to add.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the employee to add.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the employee to add.",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the employee. Optional.",
      optional: true,
    },
    supervisor: {
      type: "string",
      label: "Supervisor",
      description: "ID of the supervisor for the employee. Optional.",
      optional: true,
      async options() {
        const items = await this.getEmployees();
        return items.map((e) => ({
          value: e.id,
          label: `${e.firstName} ${e.lastName}`,
        }));
      },
    },
    leaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "ID of the leave request to approve.",
    },
    approvalDate: {
      type: "string",
      label: "Approval Date",
      description: "Date of approval for the leave request. Optional.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Approval message. Optional.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kiwihr.com/api";
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
          "X-Api-Key": this.$auth.api_key,
        },
      });
    },
    async getDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    async getLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    async getLeaveTypes(opts = {}) {
      return this._makeRequest({
        path: "/leave/types",
        ...opts,
      });
    },
    async getEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    async createEmployee(data) {
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data,
      });
    },
    async updateEmployee({
      employeeId, ...data
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/employees/${employeeId}`,
        data,
      });
    },
    async approveLeaveRequest({
      leaveRequestId, approvalDate, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/leave/requests/${leaveRequestId}/approve`,
        data: {
          approvalDate,
          message,
        },
      });
    },
    async addEmployee({
      employeeName, email, startDate, department, jobTitle, location,
    }) {
      return this.createEmployee({
        employeeName,
        email,
        startDate,
        department,
        jobTitle,
        location,
      });
    },
    async onEmployeeAdded({
      department, location,
    }) {
      const employees = await this.getEmployees({
        params: {
          department,
          location,
        },
      });
      // Handle new employee event
    },
    async onLeaveRequestCreated({
      leaveType, requestStatus,
    }) {
      const requests = await this._makeRequest({
        path: "/leave/requests",
        method: "GET",
        params: {
          leaveType,
          requestStatus,
        },
      });
      // Handle leave request event
    },
    async onEmployeeUpdated({
      employeeId, jobTitle, department,
    }) {
      const employee = await this.getEmployees({
        params: {
          employeeId,
          jobTitle,
          department,
        },
      });
      // Handle employee updated event
    },
  },
};
