import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-all-orders",
  name: "Get All Order",
  description: "Retrieve a list of all orders.[See the documentation](https://www.remoteretrieval.com/api-documentation/#pending-orders)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {},
  async run({ $: step }) {
    const response = await this.app.allOrders({
      step,
    });

    step.export("$summary", `Successfully retrieved ${response.results.length} order(s).`);

    return response;
  },
};
