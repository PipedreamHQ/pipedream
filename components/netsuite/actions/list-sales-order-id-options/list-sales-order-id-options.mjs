import netsuite from "../../netsuite.app.mjs";

export default {
  key: "netsuite-list-sales-order-id-options",
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
    netsuite,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await netsuite.propDefinitions.salesOrderId.options.call(this.netsuite, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
