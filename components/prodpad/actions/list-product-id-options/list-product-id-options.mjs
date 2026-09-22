import prodpad from "../../prodpad.app.mjs";

export default {
  key: "prodpad-list-product-id-options",
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
    prodpad,
  },
  async run({ $ }) {
    const options = await prodpad.propDefinitions.productId.options.call(this.prodpad);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
