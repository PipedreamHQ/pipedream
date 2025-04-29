import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "lucca",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        const { data: { items } } = await this.listUsers({
          params: {
            paging: `${LIMIT * page},${LIMIT}`,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "The ID of the leave request to approve",
      async options({ page }) {
        const { data: { items } } = await this.listLeaveRequests({
          params: {
            paging: `${LIMIT * page},${LIMIT}`,
            status: 0,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    legalEntityId: {
      type: "integer",
      label: "Legal Entity ID",
      description: "The ID of the legal entity",
      async options({ page }) {
        const { items } = await this.listEstablishments({
          params: {
            paging: `${LIMIT * page},${LIMIT}`,
            status: 0,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    departmentId: {
      type: "integer",
      label: "Department ID",
      description: "The ID of the department",
      async options({ page }) {
        const { data: { items } } = await this.listDepartments({
          params: {
            paging: `${LIMIT * page},${LIMIT}`,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    nationalityId: {
      type: "string",
      label: "Nationality",
      description: "The nationality of the user",
      async options() {
        const { items } = await this.listCountries();
        return items.map(({
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
      return `${this.$auth.api_url}`;
    },
    _headers() {
      return {
        "authorization": `lucca application=${this.$auth.api_key}`,
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
    listLeaveTypes(opts = {}) {
      return this._makeRequest({
        path: "/api/v3/leaveperiods/leavetypes",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/api/v3/users",
        ...opts,
      });
    },
    listLeaveRequests(opts = {}) {
      return this._makeRequest({
        path: "/api/v3/leaveRequests",
        ...opts,
      });
    },
    listEstablishments(opts = {}) {
      return this._makeRequest({
        path: "/organization/structure/api/establishments",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/organization/structure/api/countries",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/api/v3/departments",
        ...opts,
      });
    },
    approveLeaveRequest({
      leaveRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v3/leaveRequests/${leaveRequestId}/approvals`,
        ...opts,
      });
    },
    updateUserProfile({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/api/v3/users/${userId}`,
        ...opts,
      });
    },
    listExpenseClaims(opts = {}) {
      return this._makeRequest({
        path: "/api/v3/expenseClaims",
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
        params.paging = `${LIMIT * page},${LIMIT}`;
        page++;
        const { data: { items } } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
