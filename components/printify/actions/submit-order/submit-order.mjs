import printify from "../../printify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printify-submit-order",
  name: "Submit Order",
  description: "Places an order of an existing product on Printify. [See the documentation](https://developers.printify.com/#submit-an-order)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printify,
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    productId: {
      propDefinition: [
        printify,
        "productId",
      ],
    },
    quantity: {
      propDefinition: [
        printify,
        "quantity",
        (c) => ({
          previousValue: c.quantity,
        }), // Pass the previously configured value if needed
      ],
      optional: true,
    },
    shippingDetails: {
      propDefinition: [
        printify,
        "shippingDetails",
        (c) => ({
          previousValue: c.shippingDetails,
        }), // Pass the previously configured value if needed
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printify.placeOrder({
      shopId: this.shopId,
      productId: this.productId,
      quantity: this.quantity,
      shippingDetails: this.shippingDetails,
    });

    $.export("$summary", `Successfully placed order for product ID: ${this.productId}`);
    return response;
  },
};
