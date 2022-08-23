import ynab from "ynab";

export default {
  type: "app",
  app: "you_need_a_budget",
  propDefinitions: {
    // eslint-disable-next-line pipedream/props-description
    budgetId: {
      type: "string",
      label: "Budget ID",
      async options() {
        const { budgets } = await this.getBudgets();
        return budgets.map((budget) => ({
          label: budget.name,
          value: budget.id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Account",
      async options({ budgetId }) {
        const { accounts } = await this.getAccounts({
          budgetId,
        });
        return accounts.map((account) => ({
          label: account.name,
          value: account.id,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The category for a budget",
      withLabel: true,
      async options({ budgetId }) {
        const { category_groups: groups } = await this.getCategories({
          budgetId,
        });
        return groups.map((group) => group.categories.map((category) => ({
          label: `${group.name}: ${category.name}`,
          value: category.id,
        }))).flat();
      },
    },
    month: {
      type: "string",
      label: "Month",
      description: "The month for a budget",
      default: "current",
      async options({ budgetId }) {
        const { months } = await this.getMonths({
          budgetId,
        });
        const options = months
          .filter((month) => !month.deleted)
          .map(({ month }) => month);
        return [
          "current",
        ].concat(options);
      },
    },
    payee: {
      type: "string",
      label: "Payee",
      description: "Select an ID or type in a new name and a payee will be created",
      async options({ budgetId }) {
        const { payees } = await this.getPayees({
          budgetId,
        });
        return payees.map((payee) => ({
          label: payee.name,
          value: payee.id,
        }));
      },
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date - e.g. `2021-11-29`",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount - e.g. `290.99`",
    },
  },
  methods: {
    _isUUID(value) {
      const hyphen = "-";
      return value.length === 36
        && value.charAt(8) === hyphen
        && value.charAt(13) === hyphen
        && value.charAt(18) === hyphen
        && value.charAt(23) === hyphen;
    },
    _client() {
      return new ynab.API(this.$auth.oauth_access_token);
    },
    throwFormattedError(error) {
      const message = JSON.stringify(error, null, 2);
      console.error(message);
      throw new Error(message);
    },
    /**
     * YNAB uses a special format called milliunit as described in link below:
     * https://api.youneedabudget.com/#formats
     */
    _convertToMilliunit(value) {
      if (value.includes(",")) {
        value = value.replace(",", ".");
      }
      return parseFloat(value).toFixed(2) * 1000;
    },
    convertFromMilliunit(value) {
      return value / 1000;
    },
    async getBudgets() {
      const response = await this._client().budgets.getBudgets();
      return response.data;
    },
    async getAccounts({ budgetId: budget_id }) {
      const response = await this._client().accounts.getAccounts(budget_id);
      return response.data;
    },
    async getAccount({
      budgetId, accountId,
    }) {
      const response = await this._client().accounts.getAccountById(budgetId, accountId);
      return response.data;
    },
    async getMonths({ budgetId: budget_id }) {
      const response = await this._client().months.getBudgetMonths(budget_id);
      return response.data;
    },
    async getBudget({
      budgetId, month,
    }) {
      const response = await this._client().months.getBudgetMonth(budgetId, month);
      return response.data;
    },
    async getCategories({ budgetId: budget_id }) {
      const response = await this._client().categories.getCategories(budget_id);
      return response.data;
    },
    async getPayees({ budgetId: budget_id }) {
      const response = await this._client().payees.getPayees(budget_id);
      return response.data;
    },
    async getTransactions({
      budgetId, sinceDate, lastKnowledgeOfServer,
    }) {
      const response = await this._client().transactions.getTransactions(
        budgetId,
        sinceDate,
        null,
        lastKnowledgeOfServer,
      );
      return response.data;
    },
    async getTransactionsByAccount({
      budgetId, accountId, sinceDate, lastKnowledgeOfServer,
    }) {
      const response = await this._client().transactions.getTransactionsByAccount(
        budgetId,
        accountId,
        sinceDate,
        null,
        lastKnowledgeOfServer,
      );
      return response.data;
    },
    async getTransactionsByCategory({
      budgetId, categoryId, sinceDate, lastKnowledgeOfServer,
    }) {
      const response = await this._client().transactions.getTransactionsByCategory(
        budgetId,
        categoryId,
        sinceDate,
        null,
        lastKnowledgeOfServer,
      );
      return response.data;
    },
    async createTransaction({
      budgetId, accountId, categoryId, payee, cleared, amount, ...data
    }) {
      const transaction = {
        account_id: accountId,
        category_id: categoryId,
        amount: this._convertToMilliunit(amount),
        ...data,
      };
      if (cleared) transaction.cleared = "cleared";
      if (this._isUUID(payee)) {
        transaction.payee_id = payee;
      } else {
        transaction.payee_name = payee;
      }
      const response = await this._client().transactions.createTransaction(
        budgetId,
        {
          transaction,
        },
      );
      return response.data;
    },
    async updateCategoryBudget({
      budgetId, categoryId, month, budget,
    }) {
      const response = await this._client().categories.updateMonthCategory(
        budgetId,
        month,
        categoryId,
        {
          category: {
            budgeted: this._convertToMilliunit(budget),
          },
        },
      );
      return response.data;
    },
  },
};
