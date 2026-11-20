import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dpd2-new-purchase-created",
  name: "New Purchase Created",
  description: "Emit new event when a purchase is made and paid for. [See the documentation](https://docs.getdpd.com/api/reference/operations/listpurchases/)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storefrontId: {
      propDefinition: [
        common.props.dpd2,
        "storefrontId",
      ],
      description: "Only purchases from this store, e.g. `14056`. Leave empty for all your stores. Use **List Storefront ID Options** to find store IDs.",
    },
    productId: {
      propDefinition: [
        common.props.dpd2,
        "productId",
        (c) => ({
          storefrontId: c.storefrontId,
        }),
      ],
      description: "Only purchases that include this product, e.g. `22537`. Use **Find Product** to look up a product's ID.",
    },
    customerId: {
      propDefinition: [
        common.props.dpd2,
        "customerId",
      ],
      description: "Only this customer's purchases, e.g. `9437584`. Use **Find Customer** or **List Customer ID Options** to find customer IDs.",
    },
  },
  methods: {
    ...common.methods,
    getRecords(since) {
      return this.dpd2.listAll({
        fn: this.dpd2.listPurchases,
        params: {
          date_min: since || this.dpd2.toIsoDate(Date.now() / 1000 - 30 * 86400),
          storefront_id: this.storefrontId,
          product_id: this.productId,
          customer_id: this.customerId,
        },
        maxPages: Infinity,
      });
    },
    generateMeta(purchase) {
      return {
        id: purchase.id,
        summary: `New purchase #${purchase.id} from ${purchase.buyer_email}`,
        ts: Number(purchase.created_at) * 1000,
      };
    },
  },
  sampleEmit,
};
