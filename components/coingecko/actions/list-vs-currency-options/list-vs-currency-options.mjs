import coingecko from "../../coingecko.app.mjs";

export default {
  key: "coingecko-list-vs-currency-options",
  name: "List vs Currency Options",
  description: "Retrieves available options for the vs Currency field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coingecko,
  },
  async run({ $ }) {
    const options = await coingecko.propDefinitions.vsCurrency.options.call(this.coingecko);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
