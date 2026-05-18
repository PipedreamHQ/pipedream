import alegra from "../../alegra.app.mjs";

export default {
  key: "alegra-list-price-list-options",
  name: "List Price List Options",
  description: "Retrieves available options for the Price List field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    alegra,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await alegra.propDefinitions.priceList.options
      .call(this.alegra, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
