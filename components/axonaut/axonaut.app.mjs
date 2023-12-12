import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "axonaut",
  propDefinitions: {
    companyId: {
      label: "Company ID",
      description: "The company ID",
      type: "string",
      async options() {
        const companies = await this.getCompanies();

        return companies.map((company) => ({
          value: company.id,
          label: company.name,
        }));
      },
    },
    employeeId: {
      label: "Employee ID",
      description: "The employee ID",
      type: "string",
      async options() {
        const employees = await this.getEmployees();

        return employees.map((employee) => ({
          value: employee.id,
          label: employee.firstname,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://axonaut.com/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          userApiKey: this._apiKey(),
        },
        ...args,
      });
    },
    async createCompany(args = {}) {
      return this._makeRequest({
        path: "/companies",
        method: "post",
        ...args,
      });
    },
    async updateCompany({
      companyId, ...args
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}`,
        method: "patch",
        ...args,
      });
    },
    async getCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    async createEmployee(args = {}) {
      return this._makeRequest({
        path: "/employees",
        method: "post",
        ...args,
      });
    },
    async updateEmployee({
      employeeId, ...args
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}`,
        method: "patch",
        ...args,
      });
    },
    async getEmployees(args = {}) {
      return this._makeRequest({
        path: "/employees",
        ...args,
      });
    },
  },
};
