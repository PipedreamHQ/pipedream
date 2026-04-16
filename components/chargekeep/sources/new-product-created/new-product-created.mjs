import common from "../common/base-polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "chargekeep-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Type",
      description: "The type of the product",
      options: constants.PRODUCT_TYPES,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getResults() {
      return this.chargekeep.listProducts({
        params: {
          type: this.type,
        },
      });
    },
    generateMeta(product) {
      return {
        id: product.id,
        summary: `New Product: ${product.name}`,
        ts: Date.now(),
      };
    },
  },
};
