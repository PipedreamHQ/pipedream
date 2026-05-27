import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-list-order-id-options",
  name: "List Order ID Options",
  description: "Retrieves available options for the Order ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
  },
  async run({ $ }) {
    const options = await virtualsms.propDefinitions.orderId.options.call(this.virtualsms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
