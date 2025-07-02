import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-update-inventory-level",
  name: "Update Inventory Level",
  description: "Update an inventory level. [See the documentation](https://apidocs.orderspace.com/#update-inventory-levels)",
  type: "action",
  version: "0.0.{{ts}}",
  props: {
    orderspace,
  },
  async run() {

  },
};
