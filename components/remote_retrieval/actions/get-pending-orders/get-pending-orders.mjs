import app from "../../remote_retrieval.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "remote_retrieval-get-pending-orders",
  name: "Get Pending Orders",
  description: "Retrieve a list of the orders for which the payment process has not been completed.[See the documentation](https://www.remoteretrieval.com/api-documentation/#pending-orders)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {},
  async run({ $ }) {
    const results = this.app.getResourcesStream({
      resourceFn: this.app.getPendingOrders,
      resourceFnArgs: {
        $,
      },
    });
    const orders = await utils.streamIterator(results);

    $.export("$summary", `Successfully retrieved ${orders.length} pending order(s).`);

    return orders;
  },
};
