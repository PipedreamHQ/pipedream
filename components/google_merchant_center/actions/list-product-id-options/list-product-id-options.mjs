import google_merchant_center from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-list-product-id-options",
  name: "List Product ID Options",
  description: "Retrieves available options for the Product ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_merchant_center,
  },
  async run({ $ }) {
    const options = await google_merchant_center.propDefinitions.productId.options
      .call(this.google_merchant_center, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
