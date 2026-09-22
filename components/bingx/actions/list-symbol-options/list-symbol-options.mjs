import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-list-symbol-options",
  name: "List Symbol Options",
  description: "Retrieves available options for the Symbol field.",
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
    const options = await bingx.propDefinitions.symbol.options.call(this.bingx);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
