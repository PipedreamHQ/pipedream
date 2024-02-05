js;
import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-new-product-instant",
  name: "New Product Instant",
  description: "Emits an event when a product is created, updated or deleted in Altoviz.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    altoviz,
    db: "$.service.db",
    product: {
      propDefinition: [
        altoviz,
        "product",
      ],
    },
  },
  methods: {
    generateMeta(product) {
      const {
        id, name, updatedAt,
      } = product;
      const summary = `Product ${name} was updated`;
      const ts = new Date(updatedAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const product = this.product;
    const meta = this.generateMeta(product);
    this.$emit(product, meta);
  },
};
