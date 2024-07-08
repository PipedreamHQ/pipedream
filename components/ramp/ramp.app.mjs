import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ramp",
  propDefinitions: {
    state: {
      type: "string",
      label: "State",
      description: "The state of the transaction",
      required: true,
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
    directManagerId: {
      type: "string",
      label: "Direct Manager ID",
      description: "The ID of the direct manager",
      optional: true,
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
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
    spendProgramId: {
      type: "string",
      label: "Spend Program ID",
      description: "The ID of the spend program",
      optional: true,
      async options() {
        const programs = await this.getSpendPrograms();
        return programs.map((program) => ({
          label: program.name,
          value: program.id,
        }));
      },
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the spend limit",
      required: true,
    },
    linkToExistingSpendProgram: {
      type: "boolean",
      label: "Link to existing spend program?",
      description: "Whether to link the limit to an existing spend program",
      required: true,
    },
    sendPhysicalCard: {
      type: "boolean",
      label: "Send physical card?",
      description: "Whether to send a physical card",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
      required: true,
    },
    primaryCardEnabled: {
      type: "boolean",
      label: "Primary Card Enabled",
      description: "Whether the primary card is enabled",
      required: true,
    },
    reimbursementsEnabled: {
      type: "boolean",
      label: "Reimbursements Enabled",
      description: "Whether reimbursements are enabled",
      required: true,
    },
    totalLimitPerInterval: {
      type: "integer",
      label: "Total Limit Per Interval (USD)",
      description: "The total spend limit per interval in USD",
      required: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "The interval for the spend limit",
      options: [
        "Daily",
        "Weekly",
        "Monthly",
        "Yearly",
      ],
      required: true,
    },
    maximumSpendPerTransaction: {
      type: "integer",
      label: "Maximum Spend Per Transaction (USD)",
      description: "The maximum amount that can be spent per transaction in USD",
      optional: true,
    },
    allowedCategories: {
      type: "string[]",
      label: "Allowed Categories",
      description: "The categories that are allowed for this spend limit",
      optional: true,
    },
    allowedVendors: {
      type: "string[]",
      label: "Allowed Vendors",
      description: "The vendors that are allowed for this spend limit",
      optional: true,
    },
    blockedCategories: {
      type: "string[]",
      label: "Blocked Categories",
      description: "The categories that are blocked for this spend limit",
      optional: true,
    },
    blockedMccCodes: {
      type: "string[]",
      label: "Blocked MCC Codes",
      description: "The MCC codes that are blocked for this spend limit",
      optional: true,
    },
    blockedVendors: {
      type: "string[]",
      label: "Blocked Vendors",
      description: "The vendors that are blocked for this spend limit",
      optional: true,
    },
    isShareable: {
      type: "boolean",
      label: "Is Shareable?",
      description: "Whether the spend limit is shareable",
      optional: true,
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async listTransactions(ctx = this, state, defaultPageSize, latestTransactionId) {
      const params = {
        order_by_date_asc: true,
        page_size: defaultPageSize,
        state,
      };
      if (latestTransactionId) {
        params.start = latestTransactionId;
      }
      return axios(ctx, this._getAxiosParams({
        path: "/transactions",
        method: "GET",
        params,
      }));
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
    async getUsers() {
      return axios(this._getAxiosParams({
        path: "/users",
        method: "GET",
      }));
    },
    async getSpendPrograms() {
      return axios(this._getAxiosParams({
        path: "/spend-programs",
        method: "GET",
      }));
    },
    async inviteUser(ctx = this, departmentId, directManagerId, locationId, role) {
      return axios(ctx, this._getAxiosParams({
        path: "/users/invite",
        method: "POST",
        data: {
          department_id: departmentId,
          direct_manager_id: directManagerId,
          location_id: locationId,
          role,
        },
      }));
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
    async createLimit(ctx = this, displayName, linkToExistingSpendProgram, sendPhysicalCard, userId, primaryCardEnabled, reimbursementsEnabled, totalLimitPerInterval, interval, maximumSpendPerTransaction, allowedCategories, allowedVendors, blockedCategories, blockedMccCodes, blockedVendors, isShareable, firstName, lastName, address1, city, state, postalCode, country, address2, phone) {
      const data = {
        display_name: displayName,
        link_to_existing_spend_program: linkToExistingSpendProgram,
        send_physical_card: sendPhysicalCard,
        user_id: userId,
        primary_card_enabled: primaryCardEnabled,
        reimbursements_enabled: reimbursementsEnabled,
        total_limit_per_interval: totalLimitPerInterval,
        interval,
        maximum_spend_per_transaction: maximumSpendPerTransaction,
        allowed_categories: allowedCategories,
        allowed_vendors: allowedVendors,
        blocked_categories: blockedCategories,
        blocked_mcc_codes: blockedMccCodes,
        blocked_vendors: blockedVendors,
        is_shareable: isShareable,
        recipient_address: {
          first_name: firstName,
          last_name: lastName,
          address1,
          city,
          state,
          postal_code: postalCode,
          country,
          address2,
          phone,
        },
      };

      return axios(ctx, this._getAxiosParams({
        path: "/limits",
        method: "POST",
        data,
      }));
    },
  },
};
