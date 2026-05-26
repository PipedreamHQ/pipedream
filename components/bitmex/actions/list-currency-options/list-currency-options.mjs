import bitmex from "../../bitmex.app.mjs";

export default {
  key: "bitmex-list-currency-options",
  name: "List Currency Options",
  description: "Retrieves available options for the Currency field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitmex,
  },
  async run({ $ }) {
    const options = await bitmex.propDefinitions.currency.options.call(this.bitmex);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
