import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-list-product-model-code-options",
  name: "List Product Model Code Options",
  description: "Retrieves available options for the Product Model Code field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    akeneo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await akeneo.propDefinitions.productModelCode.options
      .call(this.akeneo, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
