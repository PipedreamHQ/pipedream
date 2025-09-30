import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-orders",
  name: "Get Orders",
  description: "Get a list of all orders. [See the documentation](https://www.remoteretrieval.com/api-integration/#all-orders)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getOrders({
      $,
    });
    if (response?.results?.length) {
      $.export("$summary", `Successfully retrieved ${response.results.length} orders`);
    }
    return response;
  },
};
