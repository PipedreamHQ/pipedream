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
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, page,
        } = await this.listUsers(args);
        return {
          options: data.map((user) => ({
            label: (`${user?.first_name} ${user.last_name}`).trim(),
            value: user.id,
          })),
          context: {
            next: page.next,
          },
        };
      },
    },
    spendProgramId: {
      type: "string",
      label: "Spend Program ID",
      description: "The ID of the spend program",
      optional: true,
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, page,
        } = await this.listSpendPrograms(args);
        return {
          options: data.map((program) => ({
            label: program.display_name,
            value: program.id,
          })),
          context: {
            next: page.next,
          },
        };
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
    state: {
      type: "string",
      label: "State",
      description: "The state of the transaction",
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department involved in the transaction",
      optional: true,
      async options() {
        const departments = await this.getDepartments();
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location involved in the transaction",
      optional: true,
      async options() {
        const locations = await this.getLocations();
        return locations.map((loc) => ({
          label: loc.name,
          value: loc.id,
        }));
      },
    },
    merchant: {
      type: "string",
      label: "Merchant",
      description: "The merchant involved in the transaction",
      optional: true,
      async options() {
        const merchants = await this.getMerchants();
        return merchants.map((merchant) => ({
          label: merchant.name,
          value: merchant.id,
        }));
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the new user",
      options: [
        "Admin",
        "User",
      ],
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The ID of the department",
      optional: true,
      async options() {
        const departments = await this.getDepartments();
        return departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location",
      optional: true,
      async options() {
        const locations = await this.getLocations();
        return locations.map((loc) => ({
          label: loc.name,
          value: loc.id,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient",
      required: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the recipient",
      required: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first line of the recipient's address",
      required: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the recipient",
      required: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the recipient",
      required: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the recipient",
      required: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the recipient",
      required: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second line of the recipient's address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the recipient",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.ramp.com/developer/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listTransactions(ctx = this, state, defaultPageSize, latestTransactionId) {
      const params = {
        order_by_date_asc: true,
        page_size: defaultPageSize,
        state,
      };
      if (latestTransactionId) {
        params.start = latestTransactionId;
      }
      return this._makeRequest({
        path: "/transactions",
        params,
        $: ctx,
      });
    },
    async getDepartments() {
      return axios(this._getAxiosParams({
        path: "/departments",
        method: "GET",
      }));
    },
    async getLocations() {
      return axios(this._getAxiosParams({
        path: "/locations",
        method: "GET",
      }));
    },
    async getMerchants() {
      return axios(this._getAxiosParams({
        path: "/merchants",
        method: "GET",
      }));
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
    createUserInvite(opts = {}) {
      return this._makeRequest({
        path: "/users/deferred",
        method: "POST",
        ...opts,
      });
    },
    async uploadReceipt(ctx = this, transactionId, userId, file) {
      const formData = new FormData();
      formData.append("file", file);

      return axios(ctx, this._getAxiosParams({
        path: `/transactions/${transactionId}/receipts`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }));
    },
    createLimit(opts = {}) {
      return this._makeRequest({
        path: "/limits/deferred",
        method: "POST",
        ...opts,
      });
    },
  },
};
