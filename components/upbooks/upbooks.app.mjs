import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upbooks",
  propDefinitions: {
    salaryComponentId: {
      type: "string",
      label: "Salary Component Id",
      description: "The identification of the salary component.",
      async options({ page }) {
        const { data } = await this.listSalaryComponents({
          params: {
            page,
          },
        });

        return data.map(({
          _id: value, groupName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    expenseIds: {
      type: "string[]",
      label: "Expense Ids",
      description: "The identification of the expense.",
      async options({ page }) {
        const { data } = await this.listExpenses({
          params: {
            page,
          },
        });

        return data.map(({
          _id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The identification of the account.",
      async options({ page }) {
        const { data } = await this.listAccounts({
          params: {
            page,
          },
        });

        return data.map(({
          _id: value, title, category,
        }) => ({
          label: `${title} (${category.charAt(0).toUpperCase() + category.slice(1)})`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.upbooks.io/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "API-KEY": `${this.$auth.api_key}`,
        "Organization-ID": `${this.$auth.organization_id}`,
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
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/account",
        ...opts,
      });
    },
    listActivities(opts = {}) {
      return this._makeRequest({
        path: "/activity-log/all",
        ...opts,
      });
    },
    listExpenses(opts = {}) {
      return this._makeRequest({
        path: "/expense",
        ...opts,
      });
    },
    listSalaryComponents(opts = {}) {
      return this._makeRequest({
        path: "/salary-component",
        ...opts,
      });
    },
    addNewEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/employee",
        ...opts,
      });
    },
    createExpenseCategory(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/expense-category",
        ...opts,
      });
    },
    recordOutwardPayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/outward-payment",
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
            current_page, last_page,
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

        hasMore = !(current_page == last_page);

      } while (hasMore);
    },
  },
};
