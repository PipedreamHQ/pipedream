import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ontraport-transaction-created-with-product",
  name: "Transaction Created With Product (Instant)",
  description: "Emit new event when a transaction is created with a product. [See the docs](https://api.ontraport.com/doc/#transaction-created-with-product).",
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
      return `${events.TRANSACTION_CREATED_WITH_PRODUCT}(${this.productId})`;
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Trx ${data.id}`,
        ts: body.timestamp,
      };
    },
  },
};
