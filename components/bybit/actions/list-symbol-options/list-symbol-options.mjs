import bybit from "../../bybit.app.mjs";

export default {
  key: "bybit-list-symbol-options",
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
    bybit,
  },
  async run({ $ }) {
    const options = await bybit.propDefinitions.symbol.options.call(this.bybit, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
