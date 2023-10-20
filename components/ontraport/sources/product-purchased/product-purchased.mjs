import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ontraport-product-purchased",
  name: "Product Purchased (Instant)",
  description: "Emit new event when a product is purchased. [See the docs](https://api.ontraport.com/doc/#contact-purchases-product).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    productId: {
      propDefinition: [
        common.props.app,
        "productId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return `${events.PURCHASE_PRODUCT}(${this.productId})`;
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Purchase ${data.id}`,
        ts: body.timestamp,
      };
    },
  },
};
