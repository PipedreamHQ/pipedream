import salesflare from "../../salesflare.app.mjs";

export default {
  key: "salesflare-list-currency-options",
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
    salesflare,
  },
  async run({ $ }) {
    const options = await salesflare.propDefinitions.currency.options.call(this.salesflare);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
