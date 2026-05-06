import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "rydoo",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User",
      description: "The user to whom the expense belongs",
      async options({ page }) {
        const { data: users } = await this.listUsers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
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
      description: "The group to assign to the expense",
      async options({ page }) {
        const { data: groups } = await this.listGroups({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
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
      description: "The expense category",
      async options({ page }) {
        const { data: categories } = await this.listCategories({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
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
      description: "The project to associate with the expense",
      async options({ page }) {
        const { data: projects } = await this.listProjects({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
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
      description: "The trip to associate with the expense",
      async options({ page }) {
        const { data: trips } = await this.listTrips({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return trips.map(({
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
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
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
    createExpense(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/v3/expenses",
        ...opts,
      });
    },
  },
};
