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
    leaveTypeId: {
      type: "string",
      label: "Leave Type ID",
      description: "The ID of the leave type",
      async options({ page }) {
        const { data } = await this.getLeaveTypes({
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
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({ page }) {
        const { data } = await this.getJobs({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location",
      async options({ page }) {
        const { data } = await this.getLocations({
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
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The ID of the department",
      async options({ page }) {
        const { data } = await this.getDepartments({
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
    timeRegistrationTypeId: {
      type: "string",
      label: "Time Registration Type ID",
      description: "The ID of the time registration type",
      async options({ page }) {
        const { data } = await this.getTimeRegistrationTypes({
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
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const { data } = await this.getProjects({
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
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
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
    getCostUnits(opts = {}) {
      return this._makeRequest({
        path: "/cost-units",
        ...opts,
      });
    },
    getDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    getEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    getJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    getLeaveRequests(opts = {}) {
      return this._makeRequest({
        path: "/leave-requests",
        ...opts,
      });
    },
    getLeaveTypes(opts = {}) {
      return this._makeRequest({
        path: "/leave-types",
        ...opts,
      });
    },
    getLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    getProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    getTimeRegistrations(opts = {}) {
      return this._makeRequest({
        path: "/time-registrations",
        ...opts,
      });
    },
    getTimeRegistrationTypes(opts = {}) {
      return this._makeRequest({
        path: "/time-registration-types",
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
        path: "/leave-requests",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          meta: {
            page: current, total_pages: total,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = current < total;

      } while (hasMore);
    },
  },
};
