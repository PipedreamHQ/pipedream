import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splitwise",
  propDefinitions: {
    expense: {
      type: "integer",
      label: "Expense",
      description: "Get a specific expense.",
      async options() {
        const expenses = await this.getExpenses();
        return expenses.map((expense) => ({
          label: expense.description,
          value: expense.id,
        }));
      },
    },
    group: {
      type: "integer",
      label: "Group",
      description: "If provided, only expenses in that group will be returned, and `friend` will be ignored.",
      async options() {
        const groups = await this.getGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    friend: {
      type: "integer",
      label: "Friend",
      description: "If provided, only expenses between the current and provided user will be returned.",
      async options() {
        const friends = await this.getFriends();
        return friends.map((friend) => ({
          label: this.getPersonName(friend),
          value: friend.id,
        }));
      },
    },
    datedAfter: {
      type: "string",
      label: "Dated After",
      description: "ISO 8601 Datetime. Return expenses after this date.",
      optional: true,
    },
    datedBefore: {
      type: "string",
      label: "Dated Before",
      description: "ISO 8601 Date time. Return expenses earlier this date.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many expenses to fetch. Defaults to fetch all.",
      optional: true,
    },
  },
  methods: {
    baseUrl() {
      return "https://secure.splitwise.com/api/v3.0";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getPersonName(person) {
      const {
        first_name: firstName,
        last_name: lastName,
      } = person;
      return lastName
        ? `${firstName} ${lastName}`
        : firstName;
    },
    async getNotifications(opts = {}) {
      const path = "/get_notifications";
      const { notifications } = await this._makeRequest({
        ...opts,
        path,
      });
      return notifications;
    },
    async getGroups(opts = {}) {
      const path = "/get_groups";
      const { groups } = await this._makeRequest({
        ...opts,
        path,
      });
      return groups;
    },
    async getFriends(opts = {}) {
      const path = "/get_friends";
      const { friends } = await this._makeRequest({
        ...opts,
        path,
      });
      return friends;
    },
    async getExpenses(opts = {}) {
      const path = "/get_expenses";
      const { expenses } = await this._makeRequest({
        ...opts,
        path,
      });
      return expenses;
    },
    async getExpense({
      id, ...opts
    }) {
      const path = `/get_expense/${id}`;
      const { expense } = await this._makeRequest({
        ...opts,
        path,
      });
      return expense;
    },
    async createExpense(opts = {}) {
      const path = "/create_expense";
      const method = "POST";
      const {
        expenses,
        errors,
      } = await this._makeRequest({
        ...opts,
        path,
        method,
      });
      if (Object.keys(errors).length) {
        throw new Error(errors);
      }
      return expenses;
    },
  },
};
