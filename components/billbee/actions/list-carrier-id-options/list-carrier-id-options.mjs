import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-carrier-id-options",
  name: "List Carrier ID Options",
  description: "Retrieves available options for the Carrier ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billbee,
  },
  async run({ $ }) {
    const options = await billbee.propDefinitions.carrierId.options.call(this.billbee);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
