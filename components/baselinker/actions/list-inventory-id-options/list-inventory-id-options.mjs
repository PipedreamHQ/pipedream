import { baselinker } from "../../baselinker.app.mjs";

export default {
  key: "baselinker-list-inventory-id-options",
  name: "List Inventory ID Options",
  description: "Retrieves available options for the Inventory ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    baselinker,
  },
  async run({ $ }) {
    const options = await baselinker.propDefinitions.inventoryId.options.call(this.baselinker, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
