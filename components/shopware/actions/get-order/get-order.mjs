import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-get-order",
  name: "Get Order",
  description: "Get an order by ID. [See the documentation](https://shopware.stoplight.io/docs/admin-api/0b7d9d489b841-search-for-the-order-resources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopware,
    orderId: {
      propDefinition: [
        shopware,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.shopware.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved order with ID: ${data.id}`);
    return data;
  },
};
