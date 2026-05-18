import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-order-state-id-options",
  name: "List Order State ID Options",
  description: "Retrieves available options for the Order State ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billbee,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await billbee.propDefinitions.orderStateId.options
      .call(this.billbee, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
