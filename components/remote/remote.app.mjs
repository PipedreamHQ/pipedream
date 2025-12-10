import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "remote",
  propDefinitions: {
    employmentId: {
      type: "string",
      label: "Employment ID",
      description: "The ID of the employment to create the expense for",
      async options({ page }) {
        const { data: { employments } } = await this.listEmployments({
          params: {
            page: page + 1,
          },
        });

        return employments.map(({
          id, full_name: name, personal_email: email,
        }) => ({
          label: `${name} (${email})`,
          value: id,
        }));
      },
    },
    expenseCategorySlug: {
      type: "string",
      label: "Expense Category Slug",
      description: "The slug of the expense category to create the expense for",
      async options({ employmentId }) {
        const { data } = await this.listExpenseCategories({
          params: {
            employment_id: employmentId,
          },
        });
        return data.map(({
          slug, title,
        }) => ({
          label: title,
          value: slug,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://gateway.${this.$auth.environment}.com/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
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
    createExpense(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/expenses",
        ...args,
      });
    },
    listEmployments(args = {}) {
      return this._makeRequest({
        path: "/employments",
        ...args,
      });
    },
    listExpenseCategories(args = {}) {
      return this._makeRequest({
        path: "/expenses/categories",
        ...args,
      });
    },
    showTimeoffBalance({
      employmentId, ...args
    }) {
      return this._makeRequest({
        path: `/timeoff-balances/${employmentId}`,
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook-callbacks",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook-callbacks/${hookId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data: {
            employments,
            current_page,
            total_pages,
          },
        } = await fn({
          params,
          ...args,
        });

        for (const d of employments) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = current_page < total_pages;

      } while (hasMore);
    },
  },
};
