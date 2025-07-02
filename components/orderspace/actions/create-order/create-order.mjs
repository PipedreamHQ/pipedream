import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://apidocs.orderspace.com/#create-an-order)",
  type: "action",
  version: "0.0.{{ts}}",
  props: {
    orderspace,
  },
  async run() {

  },
};
