import pro_ledger from "../../pro_ledger.app.mjs";

export default {
  key: "pro_ledger-list-category-options",
  name: "List category Options",
  description: "Retrieves available options for the category field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pro_ledger,
  },
  async run({ $ }) {
    const options = await pro_ledger.propDefinitions.category.options.call(this.pro_ledger);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
