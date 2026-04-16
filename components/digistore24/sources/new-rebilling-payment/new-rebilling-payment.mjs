import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "digistore24-new-rebilling-payment",
  name: "New Rebilling Payment",
  description: "Emit new event when a new recurring subscription payment is processed. [See the documentation](https://dev.digistore24.com/hc/en-us/articles/38492246374673-API-reference-A-Z)",
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
      return "data.transaction_list";
    },
    getResourceFn() {
      return this.app.listTransactions;
    },
    getResourceFnArgs() {
      const args = common.methods.getResourceFnArgs.call(this);

      args.data.sort_by = "date";
      args.data.sort_order = "desc";
      args.data.search = {
        transaction_type: constants.TRANSACTION_TYPE.PAYMENT,
      };

      if (Array.isArray(this.productIds) && this.productIds?.length > 0) {
        args.data.search.product_id = this.productIds.join(",");
      }

      return args;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New rebilling payment: ${item.id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
