import invoiced from "../../invoiced.app.mjs";

export default {
  key: "invoiced-list-coupon-id-options",
  name: "List Coupon ID Options",
  description: "Retrieves available options for the Coupon ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    invoiced,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await invoiced.propDefinitions.couponId.options.call(this.invoiced, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
