import app from "../../baselinker.app.mjs";

export default {
  key: "baselinker-delete-inventory-product",
  name: "Delete Inventory Product",
  description: "It allows you to remove the product from BaseLinker catalog. [See the Documentation](https://api.baselinker.com/index.php?method=deleteInventoryProduct).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
