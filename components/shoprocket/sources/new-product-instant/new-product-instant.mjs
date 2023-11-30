import shoprocket from "../../shoprocket.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shoprocket-new-product-instant",
  name: "New Product (Instant)",
  description: "Emit new event when a product is created. [See the documentation](https://docs.shoprocket.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    shoprocket,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    productId: {
      propDefinition: [
        shoprocket,
        "productId",
      ],
    },
    productName: {
      propDefinition: [
        shoprocket,
        "productName",
      ],
    },
    productPrice: {
      propDefinition: [
        shoprocket,
        "productPrice",
      ],
      optional: true,
    },
    productStockQuantity: {
      propDefinition: [
        shoprocket,
        "productStockQuantity",
      ],
      optional: true,
    },
    productDescription: {
      propDefinition: [
        shoprocket,
        "productDescription",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      // Normally, you'd create a webhook subscription here. Since this is an instant trigger, we skip this step.
    },
    async deactivate() {
      // Normally, you'd delete a webhook subscription here. Since this is an instant trigger, we skip this step.
    },
  },
  async run(event) {
    const body = event.body;
    if (body && body.id && body.name) {
      this.$emit(body, {
        id: body.id,
        summary: `New product: ${body.name}`,
        ts: Date.now(),
      });
    } else {
      this.http.respond({
        status: 400,
        body: "Missing required product information",
      });
    }
  },
};
