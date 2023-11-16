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
        const { data } = await this.listEmployees();

        return data.map((employee) => ({
          label: `${employee.name} ${employee.last_name}`,
          value: employee.id,
        }));
      },
    },
    absenceMotiveId: {
      type: "string",
      label: "Absence Motive ID",
      description: "Identifier of the reason for Absence.",
      async options() {
        const { data } = await this.listAbscenceMotives();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    absenceTypeId: {
      type: "string",
      label: "Absence Type ID",
      description: "Absence type identifier.",
      async options() {
        const { data } = await this.listAbscenceTypes();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.convenia.com.br/api/v3/";
    },
    _apiToken() {
      return `${this.$auth.api_token}`;
    },
    _getHeaders() {
      return {
        "token": this._apiToken(),
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...args,
      });
    },
    listAbscenceMotives(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "employees/absences/motives",
      });
    },
    listAbscenceTypes(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "employees/absences/types",
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "employees",
      });
    },
    listVacations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "companies/collective-vacations",
      });
    },
    getEmployeesTerminated(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "employees/dismissed",
      });
    },
    createLeaveOfAbsence({
      employeeId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `employees/${employeeId}/absences`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {},
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          current_page: currentPage,
          last_page: lastPage,
        } = await fn({
          params,
        });
        for (const d of data) {
          yield d;
        }

        hasMore = !(currentPage == lastPage);

      } while (hasMore);
    },
  },
};
