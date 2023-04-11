import app from "../../megaventory.app.mjs";

export default {
  key: "megaventory-insert-or-update-sales-order",
  name: "Insert Or Update Sales Order",
  description: "Insert or update a sales order in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/SalesOrder/postSalesOrderSalesOrderUpdate_post_3).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
