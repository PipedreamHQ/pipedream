import chargebee from "../../chargebee.app.mjs";

export default {
  key: "chargebee-list-item-price-id-options",
  name: "List Plan Item Price ID Options",
  description: "Retrieves available options for the Plan Item Price ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chargebee,
  },
  async run({ $ }) {
    const options = await chargebee.propDefinitions.itemPriceId.options.call(this.chargebee);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
