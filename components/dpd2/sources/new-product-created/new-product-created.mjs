import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dpd2-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a product is added to one of your stores. [See the documentation](https://docs.getdpd.com/api/reference/operations/listproducts/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storefrontId: {
      propDefinition: [
        common.props.dpd2,
        "storefrontId",
      ],
      description: "Only products in this store. Leave empty for all your stores.",
    },
  },
  methods: {
    ...common.methods,
    // The API returns the whole list, with no date filter
    getRecords() {
      return this.dpd2.listProducts({
        params: {
          storefront_id: this.storefrontId,
        },
      });
    },
    generateMeta(product) {
      return {
        id: product.id,
        summary: `New product ${product.name}`,
        ts: Number(product.created_at) * 1000,
      };
    },
  },
  sampleEmit,
};
