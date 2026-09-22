import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-price-list-id-options",
  name: "List Price List ID Options",
  description: "Retrieves available options for the Price List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    orderspace,
  },
  async run({ $ }) {
    const options = await orderspace.propDefinitions.priceListId.options.call(this.orderspace);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
