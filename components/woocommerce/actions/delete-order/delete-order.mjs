import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-delete-order",
  name: "Delete Order",
  description: "Delete an existing order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#delete-an-order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    force: {
      type: "boolean",
      label: "Force",
      description: "Whether to bypass trash and force deletion. Set to `true` to permanently delete the order",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      force: this.force,
    };

    const response = await this.app.deleteOrder(this.orderId, params);

    $.export("$summary", `Successfully deleted order ID: ${this.orderId}`);

    return response;
  },
};
