import snipcart from "../../snipcart.app.mjs";

export default {
  key: "snipcart-list-discount-id-options",
  name: "List Discount ID Options",
  description: "Retrieves available options for the Discount ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snipcart,
  },
  async run({ $ }) {
    const options = await snipcart.propDefinitions.discountId.options.call(this.snipcart, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
