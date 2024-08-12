import app from "../../remote_retriever.app.mjs";

export default {
  key: "remoteretriever-get-pending-order",
  name: "Get Pending Order",
  description: "These are the orders for which the payment process has not been completed.[See the documentation](https://www.remoteretrieval.com/api-documentation/#pending-orders)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {
    getPendingOrder() {
      return this.app.makeRequest({
        path: "/pending-orders/",
      });
    },
  },
  async run({ $: step }) {
    const { getPendingOrder } = this;
    const response = await getPendingOrder({
      step,
    });

    step.export("$summary", `Successfully retrieved order with ID \`${response.id}\`.`);

    return response;
  },
};
