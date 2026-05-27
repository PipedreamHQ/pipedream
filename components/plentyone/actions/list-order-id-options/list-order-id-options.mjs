import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-list-order-id-options",
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
    plentyone,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await plentyone.propDefinitions.orderId.options.call(this.plentyone, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
