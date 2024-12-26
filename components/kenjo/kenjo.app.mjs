import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kenjo",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Props for emitting new employee added
    emitNewEmployee: {
      type: "$.interface.timer",
      label: "Emit New Employee Event",
      description: "Emit an event when a new employee is added",
    },
    filterDepartment: {
      type: "string",
      label: "Filter by Department",
      description: "Filter events by department",
      optional: true,
      async options() {
        const departments = await this.paginate(this.getDepartments);
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    filterRole: {
      type: "string",
      label: "Filter by Role",
      description: "Filter events by role",
      optional: true,
      async options() {
        const roles = await this.paginate(this.getRoles);
        return roles.map((role) => ({
          label: role.name,
          value: role.id,
        }));
      },
    },
    // Props for emitting updated leave request
    emitUpdatedLeaveRequest: {
      type: "$.interface.timer",
      label: "Emit Updated Leave Request Event",
      description: "Emit an event when a leave request is updated",
    },
    filterEmployeeId: {
      type: "string",
      label: "Filter by Employee ID",
      description: "Filter events by employee ID",
      optional: true,
      async options() {
        const employees = await this.paginate(this.listEmployees);
        return employees.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }));
      },
    },
    filterStatus: {
      type: "string",
      label: "Filter by Status",
      description: "Filter events by status",
      optional: true,
      async options() {
        const statuses = await this.paginate(this.getLeaveStatuses);
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    // Props for emitting new performance review
    emitNewPerformanceReview: {
      type: "$.interface.timer",
      label: "Emit New Performance Review Event",
      description: "Emit an event when a new performance review is created",
    },
    filterReviewType: {
      type: "string",
      label: "Filter by Review Type",
      description: "Filter events by review type",
      optional: true,
      async options() {
        const reviewTypes = await this.paginate(this.getReviewTypes);
        return reviewTypes.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    filterReviewEmployee: {
      type: "string",
      label: "Filter by Employee for Review",
      description: "Filter performance reviews by employee",
      optional: true,
      async options() {
        const employees = await this.paginate(this.listEmployees);
        return employees.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }));
      },
    },
    // Props for creating a new employee
    createEmployeeName: {
      type: "string",
      label: "Name",
      description: "The full name of the employee",
    },
    createEmployeeEmail: {
      type: "string",
      label: "Email",
      description: "The email address of the employee",
    },
    createEmployeeDepartment: {
      type: "string",
      label: "Department",
      description: "The department of the employee",
      async options() {
        const departments = await this.paginate(this.getDepartments);
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    createEmployeeRole: {
      type: "string",
      label: "Role",
      description: "The role of the employee",
      async options() {
        const roles = await this.paginate(this.getRoles);
        return roles.map((role) => ({
          label: role.name,
          value: role.id,
        }));
      },
    },
    // Props for updating an existing leave request
    updateLeaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "The ID of the leave request to update",
    },
    updateLeaveStatus: {
      type: "string",
      label: "Leave Status",
      description: "The new status of the leave request",
      async options() {
        const statuses = await this.paginate(this.getLeaveStatuses);
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    updateLeaveStartDate: {
      type: "string",
      label: "Leave Start Date",
      description: "The new start date of the leave request (YYYY-MM-DD)",
    },
    updateLeaveEndDate: {
      type: "string",
      label: "Leave End Date",
      description: "The new end date of the leave request (YYYY-MM-DD)",
    },
    // Props for generating a payslip
    generatePayslipEmployeeId: {
      type: "string",
      label: "Employee ID",
      description: "The ID of the employee",
      async options() {
        const employees = await this.paginate(this.listEmployees);
        return employees.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }));
      },
    },
    generatePayPeriodStart: {
      type: "string",
      label: "Pay Period Start Date",
      description: "The start date of the pay period (YYYY-MM-DD)",
    },
    generatePayPeriodEnd: {
      type: "string",
      label: "Pay Period End Date",
      description: "The end date of the pay period (YYYY-MM-DD)",
    },
    generateCustomNotes: {
      type: "string",
      label: "Custom Notes",
      description: "Optional custom notes to include in the payslip",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kenjo.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async paginate(fn, opts = {}, results = []) {
      const response = await fn(opts);
      if (Array.isArray(response)) {
        results.push(...response);
        return results;
      }
      if (response.items && response.items.length > 0) {
        results.push(...response.items);
        if (response.nextPage) {
          return this.paginate(fn, {
            ...opts,
            page: response.nextPage,
          }, results);
        }
      }
      return results;
    },
    // Methods for emitting new employee added
    async getDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    async getRoles(opts = {}) {
      return this._makeRequest({
        path: "/roles",
        ...opts,
      });
    },
    // Methods for emitting updated leave request
    async getLeaveStatuses(opts = {}) {
      return this._makeRequest({
        path: "/time-off-statuses",
        ...opts,
      });
    },
    // Methods for emitting new performance review
    async getReviewTypes(opts = {}) {
      return this._makeRequest({
        path: "/performance-review-types",
        ...opts,
      });
    },
    async listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    // Action: Create a new employee
    async createEmployee({
      name, email, department, role, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data: {
          name: this.createEmployeeName,
          email: this.createEmployeeEmail,
          department_id: this.createEmployeeDepartment,
          role_id: this.createEmployeeRole,
        },
        ...opts,
      });
    },
    // Action: Update an existing leave request
    async updateLeaveRequest({
      leaveRequestId, status, startDate, endDate, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/time-off-requests/${this.updateLeaveRequestId}`,
        data: {
          status: this.updateLeaveStatus,
          start_date: this.updateLeaveStartDate,
          end_date: this.updateLeaveEndDate,
        },
        ...opts,
      });
    },
    // Action: Generate a payslip
    async generatePayslip({
      employeeId, payPeriodStart, payPeriodEnd, customNotes, ...opts
    }) {
      const data = {
        employee_id: this.generatePayslipEmployeeId,
        pay_period_start: this.generatePayPeriodStart,
        pay_period_end: this.generatePayPeriodEnd,
      };
      if (this.generateCustomNotes) {
        data.custom_notes = this.generateCustomNotes;
      }
      return this._makeRequest({
        method: "POST",
        path: "/payslips",
        data,
        ...opts,
      });
    },
    // Methods for emitting events
    async emitEmployeeAddedEvent() {
      const newEmployees = await this.listEmployees();
      // Logic to detect new employees
      // This is a placeholder; actual implementation may vary
      return newEmployees;
    },
    async emitLeaveRequestUpdatedEvent() {
      const updatedLeaveRequests = await this._makeRequest({
        path: "/leave-requests/updated",
      });
      return updatedLeaveRequests;
    },
    async emitPerformanceReviewCreatedEvent() {
      const newPerformanceReviews = await this._makeRequest({
        path: "/performance-reviews/new",
      });
      return newPerformanceReviews;
    },
  },
};
