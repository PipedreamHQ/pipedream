import eodhd_apis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-list-exchange-code-options",
  name: "List Exchange Code Options",
  description: "Retrieves available options for the Exchange Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    eodhd_apis,
  },
  async run({ $ }) {
    const options = await eodhd_apis.propDefinitions.exchangeCode.options.call(this.eodhd_apis);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
