import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mx_technologies",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The unique identifier for an account.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for a user.",
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The unique identifier for a member.",
    },
    transactionCreate: {
      type: "object",
      label: "Transaction Create",
      description: "Object containing details of the transaction to be created.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user to be created.",
    },
    id: {
      type: "string",
      label: "ID",
      description: "A unique identifier for the new user. (Optional)",
      optional: true,
    },
    isDisabled: {
      type: "boolean",
      label: "Is Disabled",
      description: "Flag to indicate if the user should be disabled. (Optional)",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional metadata for the user. (Optional)",
      optional: true,
    },
    memberGuid: {
      type: "string",
      label: "Member GUID",
      description: "The unique GUID for a member.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://int-api.mx.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Accept": "application/vnd.mx.api.v20231004+json",
          "Authorization": `Basic ${this.$auth.api_key}`,
        },
      });
    },
    async listTransactionsByAccount({
      userGuid, accountGuid,
    }) {
      return this._makeRequest({
        path: `/users/${userGuid}/accounts/${accountGuid}/transactions`,
      });
    },
    async createManualTransaction({
      userGuid, accountGuid, transactionCreate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userGuid}/accounts/${accountGuid}/transactions`,
        data: {
          transaction_create: transactionCreate,
        },
      });
    },
    async listManagedAccounts({
      userGuid, memberGuid,
    }) {
      return this._makeRequest({
        path: `/users/${userGuid}/managed_members/${memberGuid}/accounts`,
      });
    },
    async listUserAccounts({ userGuid }) {
      return this._makeRequest({
        path: `/users/${userGuid}/accounts`,
      });
    },
    async createUser({
      email, id, isDisabled, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: {
          user: {
            email,
            id,
            is_disabled: isDisabled,
            metadata,
          },
        },
      });
    },
    async listManagedTransactions({
      userGuid, memberGuid, accountGuid,
    }) {
      return this._makeRequest({
        path: `/users/${userGuid}/managed_members/${memberGuid}/accounts/${accountGuid}/transactions`,
      });
    },
    async listManagedMembers({ userGuid }) {
      return this._makeRequest({
        path: `/users/${userGuid}/managed_members`,
      });
    },
  },
};
