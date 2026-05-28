import { americommerce } from "../../americommerce.app.mjs";

export default {
  key: "americommerce-list-order-status-id-options",
  name: "List Order Status ID Options",
  description: "Retrieves available options for the Order Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    americommerce,
  },
  async run({ $ }) {
    const options = await americommerce.propDefinitions.orderStatusId.options
      .call(this.americommerce, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
