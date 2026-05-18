import unirateapi from "../../unirateapi.app.mjs";

export default {
  key: "unirateapi-list-currency-code-options",
  name: "List Currency Code Options",
  description: "Retrieves available options for the Currency Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unirateapi,
  },
  async run({ $ }) {
    const options = await unirateapi.propDefinitions.currencyCode.options.call(this.unirateapi);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
