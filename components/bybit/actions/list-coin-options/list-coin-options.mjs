import bybit from "../../bybit.app.mjs";

export default {
  key: "bybit-list-coin-options",
  name: "List Coin Options",
  description: "Retrieves available options for the Coin field.",
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
    const options = await bybit.propDefinitions.coin.options.call(this.bybit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
