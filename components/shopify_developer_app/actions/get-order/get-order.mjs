import app from "../../common/rest-admin.mjs";

export default {
  key: "shopify_developer_app-get-order",
  name: "Get Order",
  description: "Retrieve an order by specifying the order ID. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2024-10/resources/order#get-orders)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrder({
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved order with ID: ${this.orderId}`);
    return response;
  },
};
