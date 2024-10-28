import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onbee_app",
  propDefinitions: {
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the Employee",
      async options() {
        const response = await this.getEmployees();

        const employeeIds = response.payload;

        return employeeIds.map(({
          _id, firstname, surname,
        }) => ({
          value: _id,
          label: `${firstname} ${surname}`,
        }));
      },
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    surname: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    privateEmail: {
      type: "string",
      label: "Private Email",
      description: "Private email of the employee",
      optional: true,
    },
    workEmail: {
      type: "string",
      label: "Work Email",
      description: "Work email of the employee",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Date of birth of the employee, i.e.: `1997-12-03`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.workspace_name}.onbee.app/api`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createEmployee(args = {}) {
      return this._makeRequest({
        path: "/employees/add",
        method: "post",
        ...args,
      });
    },
    async updateEmployee({
      employeeId, ...args
    }) {
      return this._makeRequest({
        path: `/employees/edit/${employeeId}`,
        method: "post",
        ...args,
      });
    },
    async deleteEmployee({
      employeeId, ...args
    }) {
      return this._makeRequest({
        path: `/employee-delete/${employeeId}`,
        ...args,
      });
    },
    async getEmployees(args = {}) {
      return this._makeRequest({
        path: "/employee-list/",
        ...args,
      });
    },
  },
};
