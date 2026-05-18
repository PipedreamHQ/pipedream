import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-stock-id-options",
  name: "List Stock ID Options",
  description: "Retrieves available options for the Stock ID field.",
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
      propDefinition: [
        billbee,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await billbee.propDefinitions.stockId.options
      .call(this.billbee, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
