import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-completed-orders",
  name: "Get Completed Orders",
  description: "Get a list of orders where payment has already been completed. [See the documentation](https://www.remoteretrieval.com/api-documentation/#completed-orders)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getCompletedOrders({
      $,
      params: {
        page: this.page,
      },
    });
    $.export("$summary", `Successfully sent request. Response: '${response.message}'`);
    return response;
  },
};
