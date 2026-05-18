import chargekeep from "../../chargekeep.app.mjs";

export default {
  key: "chargekeep-list-currency-id-options",
  name: "List Currency ID Options",
  description: "Retrieves available options for the Currency ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chargekeep,
  },
  async run({ $ }) {
    const options = await chargekeep.propDefinitions.currencyId.options.call(this.chargekeep);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
