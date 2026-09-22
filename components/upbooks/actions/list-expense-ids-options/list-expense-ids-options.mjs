import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-list-expense-ids-options",
  name: "List Expense Ids Options",
  description: "Retrieves available options for the Expense Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upbooks,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await upbooks.propDefinitions.expenseIds.options.call(this.upbooks, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
