import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-shipping-method",
  name: "Get Shipping Method",
  description: "Retrieve a shipping method by ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/shipping-methods/operations/get-a-shipping-method)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    shippingMethodId: {
      propDefinition: [
        app,
        "shippingMethodId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      shippingMethodId,
    } = this;

    const response = await app.getShippingMethod({
      $,
      shippingMethodId,
    });

    $.export("$summary", `Successfully retrieved shipping method \`${shippingMethodId}\``);

    return response;
  },
};

