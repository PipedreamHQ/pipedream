import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "convenia",
  propDefinitions: {
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The ID of the employee",
      async options() {
        const employees = await this.getEmployees();
        return employees.map((employee) => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.convenia.com.br/api/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.token}`,
        },
      });
    },
    async getEmployees(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/employees",
      });
    },
    async createLeaveOfAbsence(employeeId, data) {
      return this._makeRequest({
        method: "POST",
        path: `/employees/${employeeId}/absences`,
        data,
      });
    },
  },
};
