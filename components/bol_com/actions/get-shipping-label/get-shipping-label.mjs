import bolCom from "../../bol_com.app.mjs";

export default {
  key: "bol_com-get-shipping-label",
  name: "Get Shipping Label",
  description: "Get a shipping label. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Shipping-Labels/operation/get-shipping-label)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    shippingLabelId: {
      type: "string",
      label: "Shipping Label ID",
      description: "The ID of a shipping label. Example: `6ff736b5-cdd0-4150-8c67-78269ee986f5`",
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.getShippingLabel({
      $,
      shippingLabelId: this.shippingLabelId,
    });
    $.export("$summary", `Successfully retrieved shipping label: ${this.shippingLabelId}`);
    return response;
  },
};
