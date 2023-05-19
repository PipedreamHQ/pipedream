import app from "../../baselinker.app.mjs";

export default {
  key: "baselinker-update-order-status",
  name: "Update Order Status",
  description: "It allows you to change order status. [See the Documentation](https://api.baselinker.com/index.php?method=setOrderStatus).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
