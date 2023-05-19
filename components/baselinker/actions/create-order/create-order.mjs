import app from "../../baselinker.app.mjs";

export default {
  key: "baselinker-create-order",
  name: "Create Order",
  description: "It allows adding a new order to the BaseLinker order manager. [See the Documentation](https://api.baselinker.com/index.php?method=addOrder).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
