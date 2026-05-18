import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-list-shipping-provider-id-options",
  name: "List Shipping Provider Id Options",
  description: "Retrieves available options for the Shipping Provider Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    picqer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await picqer.propDefinitions.shippingProviderId.options.call(this.picqer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
