import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "veedea-new-product-purchase-created",
  name: "New Product Purchase Created",
  description: "Emit new event when a new product purchase is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.veedea,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.veedea.listProductPurchases;
    },
    getTsField() {
      return "purchase_datetime";
    },
    getArgs() {
      return {
        params: {
          campaignId: this.campaignId,
        },
      };
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Product Purchase Created: ${item.prod_name}`,
        ts: Date.parse(item[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
