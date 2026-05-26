import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-list-coupon-code-options",
  name: "List Coupon Code Options",
  description: "Retrieves available options for the Coupon Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chargify,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await chargify.propDefinitions.couponCode.options.call(this.chargify, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
