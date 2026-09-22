import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-customer-group-id-options",
  name: "List Customer Group ID Options",
  description: "Retrieves available options for the Customer Group ID field.",
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
    const options = await orderspace.propDefinitions.customerGroupId.options.call(this.orderspace);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
