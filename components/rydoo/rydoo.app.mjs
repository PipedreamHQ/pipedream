import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "rydoo",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User",
      description: "The user to whom the expense belongs (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listUsers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const users = response?.data || response;
        return users.map(({
          id, firstName, lastName, email,
        }) => ({
          label: firstName && lastName
            ? `${firstName} ${lastName}`
            : (email || id),
          value: id,
        }));
      },
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The total value of the expense (e.g., `49.99`)",
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "ISO 4217 three-letter currency code (e.g., `EUR`, `USD`, `GBP`)",
    },
    expenseDate: {
      type: "string",
      label: "Expense Date",
      description: "The date of the expense in ISO 8601 format (e.g., `2024-06-15T00:00:00Z`)",
    },
    groupId: {
      type: "string",
      label: "Group",
      description: "The group to assign to the expense (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listGroups({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const groups = response?.data || response;
        return groups.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category",
      description: "The expense category (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listCategories({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const categories = response?.data || response;
        return categories.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The project to associate with the expense (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listProjects({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const projects = response?.data || response;
        return projects.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-3 country code where the expense occurred (e.g., `DEU`, `GBR`, `USA`)",
    },
    merchantName: {
      type: "string",
      label: "Merchant Name",
      description: "The name of the merchant or vendor (e.g., `Uber`, `Amazon`)",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A note or description for the expense",
    },
    tripId: {
      type: "string",
      label: "Trip",
      description: "The trip to associate with the expense (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listTrips({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const trips = response?.data || response;
        return trips.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    parentGroupId: {
      type: "string",
      label: "Parent Group",
      description: "Retrieve groups with the specified parent group. If not set, returns only root-level groups (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listGroups({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const groups = response?.data || response;
        return groups.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    branchId: {
      type: "string",
      label: "Branch",
      description: "The unique identifier of a branch (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listBranches({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const branches = response?.data || response;
        return branches.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    branchIds: {
      type: "string[]",
      label: "Branches",
      description: "The unique identifiers of one or more branches (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
      async options({ page }) {
        const response = await this.listBranches({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        const branches = response?.data || response;
        return branches.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    paymentMethodId: {
      type: "string",
      label: "Payment Method ID",
      description: "The UUID of the payment method the transaction belongs to",
      async options({ userId }) {
        const response = await this.listPaymentMethods();
        const allMethods = response?.data || response;
        const paymentMethods = (Array.isArray(allMethods)
          ? allMethods
          : [])
          .filter(({ user }) => user.id === userId);
        return paymentMethods.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    receiptId: {
      type: "string",
      label: "Receipt ID",
      description: "The UUID of a previously uploaded receipt image or attachment to link to this expense",
    },
    customFieldValues: {
      type: "string[]",
      label: "Custom Field Values",
      description: "Custom field values for the expense. Each entry must be a JSON object with `fieldId` and `value` properties (e.g., `{\"fieldId\": \"uuid\", \"value\": \"text\"}`)",
    },
    customExchangeRates: {
      type: "string[]",
      label: "Custom Exchange Rates",
      description: "Custom exchange rate overrides. Each entry must be a JSON object with `currencyCode` and `rate` properties (e.g., `{\"currencyCode\": \"USD\", \"rate\": 1.08}`)",
    },
    authentication: {
      type: "string",
      label: "Authentication",
      description: "Authentication type for the user. Defaults to company settings if unspecified",
      options: [
        "Unknown",
        "Password",
        "Sso",
      ],
    },
    languageCountryCode: {
      type: "string",
      label: "Language",
      description: "User interface language as a BCP 47 locale tag in language-region format (e.g., `en-US`, `de-DE`)",
      options: [
        "en-US",
        "nl-BE",
        "fr-FR",
        "pt-BR",
        "de-DE",
        "es-ES",
        "it-IT",
        "da-DK",
        "hu-HU",
        "cs-CZ",
        "pl-PL",
        "sk-SK",
        "zh-CN",
        "ja-JP",
        "fi-FI",
        "sv-SE",
      ],
    },
    expenseId: {
      type: "string",
      label: "Expense ID",
      description: "The unique identifier (UUID) of the expense. Pass the expense UUID returned from a previous Rydoo action (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
    },
    expenseIds: {
      type: "string[]",
      label: "Expense IDs",
      description: "An array of expense UUIDs. Pass the expense UUIDs returned from previous Rydoo actions (e.g., `d290f1ee-6c54-4b01-90e6-d701748f0851`)",
    },
  },
  methods: {
    _getEnv() {
      return this.$auth.api_url === "https://accounts.rydoo.com"
        ? "production"
        : "sandbox";
    },
    _baseUrl() {
      return `https://${this._getEnv() === "production"
        ? "api"
        : "sandbox-api"}.rydoo.com`;
    },
    _makeRequest({
      $ = this, headers: customHeaders = {}, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...customHeaders,
        },
        ...args,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        url: `/v2/users/${userId}`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        url: "/v2/users",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        url: "/v2/groups",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        url: "/v2/categories",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        url: "/v2/projects",
        ...opts,
      });
    },
    listTrips(opts = {}) {
      return this._makeRequest({
        url: "/v2/trips",
        ...opts,
      });
    },
    listBranches(opts = {}) {
      return this._makeRequest({
        url: "/v2/branches",
        ...opts,
      });
    },
    listPaymentMethods(opts = {}) {
      return this._makeRequest({
        url: "/v2/paymentmethods/all",
        ...opts,
      });
    },
    addUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v2/users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/v2/users/${userId}`,
        ...opts,
      });
    },
    rejectExpenses(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v2/expenses/reject",
        ...opts,
      });
    },
    createTrip({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/v2/users/${userId}/trips`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v2/projects",
        ...opts,
      });
    },
    createTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v2/transactions",
        ...opts,
      });
    },
    reportExpense({
      expenseId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/v3/expenses/${expenseId}/report`,
        ...opts,
      });
    },
    getExportedExpenses(opts = {}) {
      return this._makeRequest({
        url: "/v2/expenses/exported",
        ...opts,
      });
    },
    createExpense(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v3/expenses",
        ...opts,
      });
    },
    setExpenseAsReimbursed(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        url: "/v2/expenses/reimburse",
        ...opts,
      });
    },
  },
};
