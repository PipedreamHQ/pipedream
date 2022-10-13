import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-expense-created",
  name: "Expense Created",
  description: "Emit new event for every expense created. [See docs here](https://dev.splitwise.com/#tag/expenses/paths/~1get_expense~1{id}/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    splitwise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    group: {
      propDefinition: [
        splitwise,
        "group",
      ],
      optional: true,
    },
    friend: {
      propDefinition: [
        splitwise,
        "friend",
      ],
      optional: true,
    },
  },
  methods: {
    _getOffset() {
      return this.db.get("offset") || 0;
    },
    _setOffset(offset) {
      this.db.set("offset", offset);
    },
  },
  async run() {
    let offset = this._getOffset();
    const limit = 100;
    const all = [];

    while (true) {
      const expenses = await this.splitwise.getExpenses({
        params: {
          group_id: this.group,
          friend_id: this.friend,
          limit,
          offset,
        },
      });
      all.push(...expenses);
      if (expenses.length < limit) {
        break;
      }
      offset++;
    }

    this._setOffset(offset);

    for (const expense of all) {
      this.$emit(expense, {
        id: expense.id,
        summary: `New expense: ${expense.description}`,
        ts: Date.parse(expense.created_at),
      });
    }
  },
};
