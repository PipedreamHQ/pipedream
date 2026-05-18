import activecalculator from "../../activecalculator.app.mjs";

export default {
  key: "activecalculator-list-calculator-ids-options",
  name: "List Calculator Ids Options",
  description: "Retrieves available options for the Calculator Ids field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    activecalculator,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await activecalculator.propDefinitions.calculatorIds.options
      .call(this.activecalculator, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
