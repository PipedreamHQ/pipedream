import order_desk from "../../order_desk.app.mjs";

export default {
  key: "order_desk-list-order-id-options",
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
    order_desk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await order_desk.propDefinitions.order_id.options.call(this.order_desk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
