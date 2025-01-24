import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "charthop",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Event Filters for New Employee Added
    newEmployeeDepartmentFilter: {
      type: "string",
      label: "Department Filter",
      description: "Optional department filter for new employee events.",
      optional: true,
    },
    newEmployeeRoleFilter: {
      type: "string",
      label: "Role Filter",
      description: "Optional role filter for new employee events.",
      optional: true,
    },
    // Event Filters for Compensation Details Updated
    compensationDepartmentFilter: {
      type: "string",
      label: "Department Filter",
      description: "Optional department filter for compensation update events.",
      optional: true,
    },
    compensationEmployeeIdFilter: {
      type: "string",
      label: "Employee ID Filter",
      description: "Optional employee ID filter for compensation update events.",
      optional: true,
    },
    // Event Filters for Organizational Structure Changes
    orgStructureTeamFilter: {
      type: "string",
      label: "Team Filter",
      description: "Optional team filter for organizational structure change events.",
      optional: true,
    },
    orgStructureDivisionFilter: {
      type: "string",
      label: "Division Filter",
      description: "Optional division filter for organizational structure change events.",
      optional: true,
    },

    // Action: Add New Employee
    addEmployeeName: {
      type: "string",
      label: "Employee Name",
      description: "Name of the new employee.",
    },
    addEmployeeEmail: {
      type: "string",
      label: "Employee Email",
      description: "Email address of the new employee.",
    },
    addEmployeeRole: {
      type: "string",
      label: "Employee Role",
      description: "Role of the new employee.",
    },
    addEmployeeStartDate: {
      type: "string",
      label: "Start Date",
      description: "Optional start date for the new employee.",
      optional: true,
    },
    addEmployeeDepartment: {
      type: "string",
      label: "Department",
      description: "Optional department for the new employee.",
      optional: true,
    },
    addEmployeeCustomFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Optional custom fields for the new employee. Provide as JSON strings.",
      optional: true,
    },

    // Action: Update Employee Profile
    updateEmployeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee to update.",
    },
    updateFields: {
      type: "string[]",
      label: "Fields to Update",
      description: "Fields to update in the employee profile. Provide as JSON strings.",
    },
    updateMetadata: {
      type: "string",
      label: "Metadata",
      description: "Optional metadata for the employee update. Provide as a JSON string.",
      optional: true,
    },

    // Action: Modify Compensation Records
    modifyCompensationEmployeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee for compensation update.",
    },
    modifyCompensationDetails: {
      type: "string",
      label: "Compensation Details",
      description: "Details of the compensation update. Provide as a JSON string.",
    },
    modifyCompensationEffectiveDate: {
      type: "string",
      label: "Effective Date",
      description: "Optional effective date for the compensation update.",
      optional: true,
    },
    modifyCompensationReason: {
      type: "string",
      label: "Reason for Change",
      description: "Optional reason for the compensation update.",
      optional: true,
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    _baseUrl() {
      return "https://api.charthop.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    // Event: Emit New Employee Added Event
    async emitNewEmployeeAddedEvent(opts = {}) {
      const data = {};
      if (this.newEmployeeDepartmentFilter) data.department = this.newEmployeeDepartmentFilter;
      if (this.newEmployeeRoleFilter) data.role = this.newEmployeeRoleFilter;
      return this._makeRequest({
        method: "POST",
        path: "/events/new-employee-added",
        data,
      });
    },
    // Event: Emit Compensation Updated Event
    async emitCompensationUpdatedEvent(opts = {}) {
      const data = {};
      if (this.compensationDepartmentFilter) data.department = this.compensationDepartmentFilter;
      if (this.compensationEmployeeIdFilter) data.employee_id = this.compensationEmployeeIdFilter;
      return this._makeRequest({
        method: "POST",
        path: "/events/compensation-updated",
        data,
      });
    },
    // Event: Emit Organizational Structure Changed Event
    async emitOrgStructureChangedEvent(opts = {}) {
      const data = {};
      if (this.orgStructureTeamFilter) data.team = this.orgStructureTeamFilter;
      if (this.orgStructureDivisionFilter) data.division = this.orgStructureDivisionFilter;
      return this._makeRequest({
        method: "POST",
        path: "/events/org-structure-changed",
        data,
      });
    },

    // Action: Add New Employee
    async addEmployee(opts = {}) {
      const data = {
        name: this.addEmployeeName,
        email: this.addEmployeeEmail,
        role: this.addEmployeeRole,
      };
      if (this.addEmployeeStartDate) data.start_date = this.addEmployeeStartDate;
      if (this.addEmployeeDepartment) data.department = this.addEmployeeDepartment;
      if (this.addEmployeeCustomFields) {
        data.custom_fields = this.addEmployeeCustomFields.map((field) => JSON.parse(field));
      }
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data,
      });
    },

    // Action: Update Employee Profile
    async updateEmployeeProfile(opts = {}) {
      const data = {};
      if (this.updateFields) {
        data.fields_to_update = this.updateFields.map((field) => JSON.parse(field));
      }
      if (this.updateMetadata) {
        data.metadata = JSON.parse(this.updateMetadata);
      }
      return this._makeRequest({
        method: "PUT",
        path: `/employees/${this.updateEmployeeId}`,
        data,
      });
    },

    // Action: Modify Compensation Records
    async modifyCompensation(opts = {}) {
      const data = {};
      if (this.modifyCompensationDetails) {
        data.compensation_details = JSON.parse(this.modifyCompensationDetails);
      }
      if (this.modifyCompensationEffectiveDate) {
        data.effective_date = this.modifyCompensationEffectiveDate;
      }
      if (this.modifyCompensationReason) {
        data.reason = this.modifyCompensationReason;
      }
      return this._makeRequest({
        method: "PUT",
        path: `/employees/${this.modifyCompensationEmployeeId}/compensation`,
        data,
      });
    },
  },
};
