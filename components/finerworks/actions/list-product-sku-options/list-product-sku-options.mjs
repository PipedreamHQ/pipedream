import finerworks from "../../finerworks.app.mjs";

export default {
  key: "finerworks-list-product-sku-options",
  name: "List Product SKU Options",
  description: "Retrieves available options for the Product SKU field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    finerworks,
  },
  async run({ $ }) {
    const options = await finerworks.propDefinitions.productSku.options.call(this.finerworks);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
