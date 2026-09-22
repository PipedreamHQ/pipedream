import common from "../common/polling.mjs";

export default {
  ...common,
  key: "digistore24-new-purchase",
  name: "New Purchase",
  description: "Emit new event when a new purchase is created. [See the documentation](https://dev.digistore24.com/hc/en-us/articles/38492246374673-API-reference-A-Z)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "The IDs of the products to track. If not provided, all products will be tracked.",
      propDefinition: [
        common.props.app,
        "productId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    getFieldKey() {
      return "data.purchase_list";
    },
    getResourceFn() {
      return this.app.listPurchases;
    },
    getResourceFnArgs() {
      const args = common.methods.getResourceFnArgs.call(this);

      args.data.sort_by = "date";
      args.data.sort_order = "desc";

      if (Array.isArray(this.productIds) && this.productIds?.length > 0) {
        args.data.search = {
          product_id: this.productIds.join(","),
        };
      }

      return args;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New purchase: ${item.id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
