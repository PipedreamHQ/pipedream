import jumpseller from "../../jumpseller.app.mjs";

export default {
  key: "jumpseller-list-product-id-options",
  name: "List Product Options",
  description: "Retrieves available options for the Product field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jumpseller,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await jumpseller.propDefinitions.productId.options.call(this.jumpseller, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
