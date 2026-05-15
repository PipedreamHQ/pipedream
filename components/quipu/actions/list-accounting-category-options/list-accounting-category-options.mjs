import quipu from "../../quipu.app.mjs";

export default {
  key: "quipu-list-accounting-category-options",
  name: "List Accounting Category Options",
  description: "Retrieves available options for the Accounting Category field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    quipu,
  },
  async run({ $ }) {
    const options = await quipu.propDefinitions.accountingCategory.options.call(this.quipu);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
