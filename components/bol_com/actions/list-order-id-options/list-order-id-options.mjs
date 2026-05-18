import bol_com from "../../bol_com.app.mjs";

export default {
  key: "bol_com-list-order-id-options",
  name: "List Order ID Options",
  description: "Retrieves available options for the Order ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bol_com,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bol_com.propDefinitions.orderId.options
      .call(this.bol_com, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
