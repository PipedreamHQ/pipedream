import cogmento from "../../cogmento.app.mjs";

export default {
  key: "cogmento-list-product-ids-options",
  name: "List Product IDs Options",
  description: "Retrieves available options for the Product IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cogmento,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await cogmento.propDefinitions.productIds.options.call(this.cogmento, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
