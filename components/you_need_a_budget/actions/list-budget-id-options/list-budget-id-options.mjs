import you_need_a_budget from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-list-budget-id-options",
  name: "List Budget ID Options",
  description: "Retrieves available options for the Budget ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    you_need_a_budget,
  },
  async run({ $ }) {
    const options = await you_need_a_budget.propDefinitions.budgetId.options
      .call(this.you_need_a_budget, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
