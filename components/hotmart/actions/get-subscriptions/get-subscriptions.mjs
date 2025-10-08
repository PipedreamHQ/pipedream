import app from "../../hotmart.app.mjs";

export default {
  key: "hotmart-get-subscriptions",
  name: "Get Subscriptions",
  description: "Get subscribers from hotmart profile. [See the documentation](https://developers.hotmart.com/docs/pt-BR/v1/subscription/get-subscribers/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSubscriptions({
      $,
      params: {
        product_id: this.productId,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} subscription(s)`);

    return response;
  },
};
