import coupontools from "../../coupontools.app.mjs";

export default {
  key: "coupontools-list-coupon-id-options",
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
    coupontools,
  },
  async run({ $ }) {
    const options = await coupontools.propDefinitions.couponId.options.call(this.coupontools, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
