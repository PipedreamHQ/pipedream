import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "buddee",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company to create the employee for",
      async options({ page }) {
        const { data } = await this.getCompanies({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The ID of the employee",
      async options({ page }) {
        const { data } = await this.getEmployees({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, full_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    costCenterId: {
      type: "string",
      label: "Cost Center ID",
      description: "The ID of the cost center",
      async options({ page }) {
        const { data } = await this.getCostCenters({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    costUnitId: {
      type: "string",
      label: "Cost Unit ID",
      description: "The ID of the cost unit",
      async options({ page }) {
        const { data } = await this.getCostUnits({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.buddee.nl";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };
      console.log("config: ", config);
      return axios($, config);
    },
    getCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    getCostCenters(opts = {}) {
      return this._makeRequest({
        path: "/cost-centers",
        ...opts,
      });
    },
    getEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    getCostUnits(opts = {}) {
      return this._makeRequest({
        path: "/cost-units",
        ...opts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        ...opts,
      });
    },
  },
};
