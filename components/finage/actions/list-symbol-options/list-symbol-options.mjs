import finage from "../../finage.app.mjs";

export default {
  key: "finage-list-symbol-options",
  name: "List symbol Options",
  description: "Retrieves available options for the symbol field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    finage,
  },
  async run({ $ }) {
    const options = await finage.propDefinitions.symbol.options.call(this.finage);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
