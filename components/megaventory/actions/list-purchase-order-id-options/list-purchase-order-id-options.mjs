import { megaventory } from "../../megaventory.app.mjs";

export default {
  key: "megaventory-list-purchase-order-id-options",
  name: "List Purchase Order ID Options",
  description: "Retrieves available options for the Purchase Order ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    megaventory,
  },
  async run({ $ }) {
    const options = await megaventory.propDefinitions.purchaseOrderId.options
      .call(this.megaventory, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
