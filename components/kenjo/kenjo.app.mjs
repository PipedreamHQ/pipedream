import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kenjo",
  propDefinitions: {
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The identifier of an employee",
      async options() {
        const { data } = await this.listEmployees();
        return data?.filter(({ isActive }) => isActive)?.map(({
          _id: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The identifier of a company",
      async options() {
        const companies = await this.listCompanies();
        return companies?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    timeOffTypeId: {
      type: "string",
      label: "Time Off Type ID",
      description: "The identifier of a time off request type",
      async options() {
        const { data } = await this.listTimeOffTypes();
        return data?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    officeId: {
      type: "string",
      label: "Office ID",
      description: "The identifier of an office",
      optional: true,
      async options({ companyId }) {
        const offices = await this.listOffices({
          params: {
            companyId,
          },
        });
        return offices?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The identifier of a department",
      optional: true,
      async options() {
        const departments = await this.listDepartments();
        return departments?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
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
          Authorization: `${this.$auth.oauth_access_token}`,
          Accept: "application/json",
        },
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listOffices(opts = {}) {
      return this._makeRequest({
        path: "/offices",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    listTimeOffTypes(opts = {}) {
      return this._makeRequest({
        path: "/time-off/types",
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
    createLeaveRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/time-off/requests",
        ...opts,
      });
    },
    createAttendanceEntry(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/attendances",
        ...opts,
      });
    },
  },
};
