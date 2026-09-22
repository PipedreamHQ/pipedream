import e_conomic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-list-currency-code-options",
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
    e_conomic,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await e_conomic.propDefinitions.currencyCode.options.call(this.e_conomic, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
