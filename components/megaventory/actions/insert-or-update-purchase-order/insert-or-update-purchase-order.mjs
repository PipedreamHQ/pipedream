import app from "../../megaventory.app.mjs";

export default {
  key: "megaventory-insert-or-update-purchase-order",
  name: "Insert Or Update Purchase Order",
  description: "Insert or update a purchase order in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/PurchaseOrder/postPurchaseOrderPurchaseOrderUpdate_post_3).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
