import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-list-currency-options",
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
    bingx,
  },
  async run({ $ }) {
    const options = await bingx.propDefinitions.currency.options.call(this.bingx);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
