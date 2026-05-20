import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-list-product-categories-options",
  name: "List Categories Options",
  description: "Retrieves available options for the Categories field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    woocommerce,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await woocommerce.propDefinitions.productCategories.options
      .call(this.woocommerce, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
