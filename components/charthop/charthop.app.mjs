import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "charthop",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The identifier of an organization",
      async options({ prevContext }) {
        const params = prevContext?.from
          ? {
            from: prevContext.from,
          }
          : {};
        const { data } = await this.listOrgs({
          params,
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            from: options[options.length - 1].id,
          },
        };
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The identifier of an employee",
      async options({
        orgId, prevContext,
      }) {
        const params = prevContext?.from
          ? {
            from: prevContext.from,
          }
          : {};
        const { data } = await this.listUsers({
          params: {
            ...params,
            orgId,
          },
        });
        const employees = [];
        const employeeRoleId = await this.getEmployeeRoleId({
          orgId,
        });
        for (const user of data) {
          if (user.orgs.find((u) => u.orgId === orgId && u.roleId === employeeRoleId)) {
            employees.push(user);
          }
        }
        const options = employees.map(({
          id: value, name,
        }) => ({
          value,
          label: (`${name.first} ${name.last}`).trim(),
        }));
        return {
          options,
          context: {
            from: data[data.length - 1].id,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "Middle name of the employee",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    preferredFirstName: {
      type: "string",
      label: "Preferred First Name",
      description: "The preferred first name of the employee",
      optional: true,
    },
    preferredLastName: {
      type: "string",
      label: "Preferred Last Name",
      description: "The preferred last name of the employee",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the employee",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the emaployee",
      options: [
        "SUPERUSER",
        "NORMAL",
        "INACTIVE",
        "UNINSTALLED",
      ],
      optional: true,
    },
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
    _baseUrl() {
      return "https://api.charthop.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listOrgs(opts = {}) {
      return this._makeRequest({
        path: "/org",
        ...opts,
      });
    },
    listRoles({
      orgId, ...opts
    }) {
      return this._makeRequest({
        path: `/org/${orgId}/role`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/user",
        ...opts,
      });
    },
    async getEmployeeRoleId({
      orgId, ...opts
    }) {
      const { data } = await this.listRoles({
        orgId,
        ...opts,
      });
      const employeeRole = data.filter(({ label }) => label === "Employee");
      return employeeRole.id;
    },
    // Event: Emit New Employee Added Event
    async emitNewEmployeeAddedEvent(opts = {}) {
      const data = {};
      if (this.newEmployeeDepartmentFilter) data.department = this.newEmployeeDepartmentFilter;
      if (this.newEmployeeRoleFilter) data.role = this.newEmployeeRoleFilter;
      return this._makeRequest({
        method: "POST",
        path: "/events/new-employee-added",
        ...opts,
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
        ...opts,
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
        ...opts,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/user/${userId}`,
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/user/${userId}`,
        ...opts,
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
        ...opts,
      });
    },
  },
};
