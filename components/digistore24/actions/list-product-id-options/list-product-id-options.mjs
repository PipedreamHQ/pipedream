import digistore24 from "../../digistore24.app.mjs";

export default {
  key: "digistore24-list-product-id-options",
  name: "List Product ID Options",
  description: "Retrieves available options for the Product ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    digistore24,
  },
  async run({ $ }) {
    const options = await digistore24.propDefinitions.productId.options.call(this.digistore24);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
