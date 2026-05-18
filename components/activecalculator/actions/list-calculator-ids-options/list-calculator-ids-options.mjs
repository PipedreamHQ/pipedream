import activecalculator from "../../activecalculator.app.mjs";

export default {
  key: "activecalculator-list-calculator-ids-options",
  name: "List Calculator Ids Options",
  description: "Retrieves available options for the Calculator Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    activecalculator,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await activecalculator.propDefinitions.calculatorIds.options
        .call(this.activecalculator, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
