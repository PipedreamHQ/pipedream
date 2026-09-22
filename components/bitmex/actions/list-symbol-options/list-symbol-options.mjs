import bitmex from "../../bitmex.app.mjs";

export default {
  key: "bitmex-list-symbol-options",
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
    bitmex,
  },
  async run({ $ }) {
    const options = await bitmex.propDefinitions.symbol.options.call(this.bitmex);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
