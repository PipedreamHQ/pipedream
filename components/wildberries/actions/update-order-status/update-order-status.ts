import app from "../../app/wildberries.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Order Status",
  description: "Update a order status. [See docs here](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/put_api_v2_orders)",
  key: "wildberries-update-order-status",
  version: "0.0.2",
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
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    sgtin: {
      type: "any",
      label: "SGTIN",
      description: "Array required only for pharmaceutical products when they are transferred to status `Customer received the goods`.\n\n**Example:** `[{ code: string, numerator: integer, denominator: integer, sid: integer }]`\n\n[See docs here](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/put_api_v2_orders)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      orderId: this.orderId,
      status: parseInt(this.status),
      sgtin: this.sgtin,
    };
    if (this.sgtin && !Array.isArray(this.sgtin)) {
      params.sgtin = [
        this.sgtin,
      ];
    }
    const response = await this.app.updateOrderStatus($, params);
    $.export("$summary", `Successfully updated the status for order: ${this.orderId}`);
    return response;
  },
});
