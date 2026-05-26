import solve_crm from "../../solve_crm.app.mjs";

export default {
  key: "solve_crm-list-category-options",
  name: "List Category Options",
  description: "Retrieves available options for the Category field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    solve_crm,
  },
  async run({ $ }) {
    const options = await solve_crm.propDefinitions.category.options.call(this.solve_crm);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
