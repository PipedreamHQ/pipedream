import sellercloud from "../../sellercloud.app.mjs";

export default {
  key: "sellercloud-update-order-status",
  name: "Update Order Status",
  description: "Modifies the status of an existing order or orders. [See the documentation](https://developer.sellercloud.com/dev-article/update-orders-status-code/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sellercloud,
    orders: {
      propDefinition: [
        sellercloud,
        "orders",
      ],
    },
    status: {
      propDefinition: [
        sellercloud,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      Orders: this.orders,
      Status: this.status,
    };

    const response = await this.sellercloud.updateOrderStatus({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated status of order with ID ${response}`);
    }

    return response;
  },
};
