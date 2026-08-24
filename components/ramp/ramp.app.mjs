import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ramp",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listUsers,
          mapper: ({
            id: value, first_name: firstName, last_name: lastName,
          }) => ({
            value,
            label: (`${firstName} ${lastName}`).trim(),
          }),
        });
      },
    },
    spendProgramId: {
      type: "string",
      label: "Spend Program ID",
      description: "The ID of the spend program",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listSpendPrograms,
          mapper: ({
            id: value, display_name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Unique identifier of a department — a Ramp UUID, e.g. `fffe6c22-698f-4dc5-b2b1-b35f86947d90` (not a department name). Run the **List Departments** action to find valid IDs.",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listDepartments,
          mapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Unique identifier of a location — a Ramp UUID, e.g. `961c6f01-5719-4f4c-8fef-4096a031f32a` (not a location name). Run the **List Locations** action to find valid IDs.",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listLocations,
          mapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The ID of a transaction",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listTransactions,
          mapper: ({
            id: value,
            merchant_name: merchantName,
            amount,
            currency_code: currencyCode,
            user_transaction_time: userTransactionTime,
          }) => ({
            value,
            label: `${merchantName} - ${amount} ${currencyCode} - ${userTransactionTime}`,
          }),
        });
      },
    },
    allowedCategories: {
      type: "integer[]",
      label: "Allowed Categories",
      description: "List of Ramp category codes allowed for the limit",
      options: constants.CATEGORY_CODES,
      optional: true,
    },
    blockedCategories: {
      type: "integer[]",
      label: "Blocked Categories",
      description: "List of Ramp category codes blocked for the limit",
      options: constants.CATEGORY_CODES,
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The employee's role",
      options: constants.ROLES,
    },
    transferStatus: {
      type: "string",
      label: "Status",
      description: "Filter transfers by the current status",
      optional: true,
      options: constants.TRANSFER_STATUSES,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page, between 2 and 100 (default 20).",
      min: 2,
      max: 100,
      optional: true,
    },
    start: {
      type: "string",
      label: "Start (Pagination Cursor)",
      description: "Pagination cursor for the next page. Take the `start` query-parameter value from the previous response's `page.next` URL and pass it here.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of fields to include per record in addition to the compact default. Leave empty for the compact summary.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the resource.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ramp.com/developer/v1";
    },
    _getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          headers: this._getHeaders(headers),
          ...opts,
        });
      } catch (e) {
        throw new Error(JSON.parse(e.message).error_v2.message);
      }
    },
    async getPropOptions({
      prevContext,
      resourceFn,
      mapper,
    }) {
      const args = prevContext?.next
        ? {
          url: prevContext.next,
        }
        : {};

      const {
        data, page,
      } = await resourceFn(args);

      return {
        options: data.map(mapper),
        context: {
          next: page.next,
        },
      };
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listSpendPrograms(opts = {}) {
      return this._makeRequest({
        path: "/spend-programs",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    listTransactions(opts = {}) {
      return this._makeRequest({
        path: "/transactions",
        ...opts,
      });
    },
    listTransfers(opts = {}) {
      return this._makeRequest({
        path: "/transfers",
        ...opts,
      });
    },
    createLimit(opts = {}) {
      return this._makeRequest({
        path: "/limits/deferred",
        method: "POST",
        ...opts,
      });
    },
    createUserInvite(opts = {}) {
      return this._makeRequest({
        path: "/users/deferred",
        method: "POST",
        ...opts,
      });
    },
    uploadReceipt(opts = {}) {
      return this._makeRequest({
        path: "/receipts",
        method: "POST",
        ...opts,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        method: "PATCH",
        ...opts,
      });
    },
    getTransaction({
      transactionId, ...opts
    }) {
      return this._makeRequest({
        path: `/transactions/${transactionId}`,
        ...opts,
      });
    },
    listLimits(opts = {}) {
      return this._makeRequest({
        path: "/limits",
        ...opts,
      });
    },
    getLimit({
      limitId, ...opts
    }) {
      return this._makeRequest({
        path: `/limits/${limitId}`,
        ...opts,
      });
    },
    updateLimit({
      limitId, ...opts
    }) {
      return this._makeRequest({
        path: `/limits/${limitId}`,
        method: "PATCH",
        ...opts,
      });
    },
    terminateLimit({
      limitId, ...opts
    }) {
      // Ramp terminates limits via a deferred task (POST .../deferred/termination),
      // not DELETE /limits/{id} (which returns 405). The body requires an
      // idempotency_key; the endpoint returns a deferred task id.
      return this._makeRequest({
        path: `/limits/${limitId}/deferred/termination`,
        method: "POST",
        ...opts,
      });
    },
    createDepartment(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        method: "POST",
        ...opts,
      });
    },
    createLocation(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
    }) {
      const args = {
        params: {
          ...params,
          page_size: constants.DEFAULT_PAGE_SIZE,
        },
      };
      do {
        const {
          data, page,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        args.url = page.next;
      } while (args.url);
    },
  },
};
