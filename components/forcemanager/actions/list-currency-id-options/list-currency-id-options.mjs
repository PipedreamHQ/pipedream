import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-list-currency-id-options",
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
    forcemanager,
  },
  async run({ $ }) {
    const options = await forcemanager.propDefinitions.currencyId.options.call(this.forcemanager);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
