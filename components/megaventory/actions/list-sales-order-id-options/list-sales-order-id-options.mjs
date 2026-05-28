import { megaventory } from "../../megaventory.app.mjs";

export default {
  key: "megaventory-list-sales-order-id-options",
  name: "List Sales Order ID Options",
  description: "Retrieves available options for the Sales Order ID field.",
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
    const options = await megaventory.propDefinitions.salesOrderId.options
      .call(this.megaventory, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
