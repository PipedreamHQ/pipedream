import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-list-warehouse-id-options",
  name: "List Warehouse ID Options",
  description: "Retrieves available options for the Warehouse ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    plentyone,
  },
  async run({ $ }) {
    const options = await plentyone.propDefinitions.warehouseId.options.call(this.plentyone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
