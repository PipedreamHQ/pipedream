import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-get-expenses",
  name: "Get Expenses",
  description: "Gets expenses involving the current user, in reverse chronological order. [See docs here](https://dev.splitwise.com/#tag/expenses/paths/~1get_expenses/get)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    splitwise,
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
    datedAfter: {
      propDefinition: [
        splitwise,
        "datedAfter",
      ],
    },
    datedBefore: {
      propDefinition: [
        splitwise,
        "datedBefore",
      ],
    },
    limit: {
      propDefinition: [
        splitwise,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const expenses = await this.splitwise.getExpenses({
      $,
      params: {
        group_id: this.group,
        friend_id: this.friend,
        dated_after: this.datedAfter,
        dated_before: this.datedBefore,
        limit: this.limit ?? 0,
      },
    });
    const suffix = expenses.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${expenses.length} expense${suffix}`);
    return expenses;
  },
};
