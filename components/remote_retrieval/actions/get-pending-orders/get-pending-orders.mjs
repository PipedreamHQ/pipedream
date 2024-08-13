import app from "../../remote_retriever.app.mjs";

export default {
  key: "remote_retriever-get-pending-order",
  name: "Get Pending Order",
  description: "Retrieve a list of the orders for which the payment process has not been completed.[See the documentation](https://www.remoteretrieval.com/api-documentation/#pending-orders)",
  type: "action",
  version: "0.1.0",
  props: {
    app,
  },
  methods: {
  },
  async run({ $: step }) {
    const { getPendingOrder } = this;
    const response = await this.app.getPendingOrder({
      step,
    });

    step.export("$summary", `Successfully retrieved ${response.length} order(s).`);

    return response;
  },
};
