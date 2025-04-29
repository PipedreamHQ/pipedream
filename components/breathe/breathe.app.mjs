import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "breathe",
  propDefinitions: {
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The identifier of an employee",
      async options({ page }) {
        const { employees } = await this.listEmployees({
          params: {
            page: page + 1,
          },
        });
        return employees?.map(({
          id: value, first_name: firstName, last_name: lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    leaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "The identifier of a leave request",
      async options({
        page, employeeId,
      }) {
        const { leave_requests: leaveRequests } = await this.listLeaveRequests({
          params: {
            page: page + 1,
            employee_id: employeeId,
            exclude_cancelled_requests: true,
          },
        });
        return leaveRequests?.map(({
          id: value, start_date: startDate, end_date: endDate,
        }) => ({
          value,
          label: `${startDate} - ${endDate}`,
        })) || [];
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The identifier of a department",
      optional: true,
      async options({ page }) {
        const { departments } = await this.listDepartments({
          params: {
            page: page + 1,
          },
        });
        return departments?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    divisionId: {
      type: "string",
      label: "Division ID",
      description: "The identifier of a division",
      optional: true,
      async options() {
        const { divisions } = await this.listDivisions();
        return divisions?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The identifier of a location",
      optional: true,
      async options() {
        const { locations } = await this.listLocations();
        return locations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    workingPatternId: {
      type: "string",
      label: "Working Pattern ID",
      description: "The identifier of a working pattern",
      optional: true,
      async options() {
        const { working_patterns: workingPatterns } = await this.listWorkingPatterns();
        return workingPatterns?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    holidayAllowanceId: {
      type: "string",
      label: "Holiday Allowance ID",
      description: "The identifier of a holiday allowance",
      optional: true,
      async options() {
        const { holiday_allowances: holidayAllowances } = await this.listHolidayAllowances();
        return holidayAllowances?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/v1`;
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
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/employees",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listDivisions(opts = {}) {
      return this._makeRequest({
        path: "/divisions",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    listWorkingPatterns(opts = {}) {
      return this._makeRequest({
        path: "/working_patterns",
        ...opts,
      });
    },
    listHolidayAllowances(opts = {}) {
      return this._makeRequest({
        path: "/holiday_allowances",
        ...opts,
      });
    },
    listLeaveRequests(opts = {}) {
      return this._makeRequest({
        path: "/leave_requests",
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
    createLeaveRequest({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/employees/${employeeId}/leave_requests`,
        ...opts,
      });
    },
    approveLeaveRequest({
      leaveRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/leave_requests/${leaveRequestId}/approve`,
        ...opts,
      });
    },
    rejectLeaveRequest({
      leaveRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/leave_requests/${leaveRequestId}/reject`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceKey,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let total;
      do {
        const response = await resourceFn(args);
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
        }
        total = items?.length;
        args.params.page++;
      } while (total);
    },
  },
};
