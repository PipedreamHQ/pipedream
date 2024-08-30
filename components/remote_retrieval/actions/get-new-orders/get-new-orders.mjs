import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-new-orders",
  name: "Get New Orders",
  description: "Get a list of new orders. [See the documentation](https://www.remoteretrieval.com/api-documentation/#new-orders)",
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
    const response = await this.app.getNewOrders({
      $,
      params: {
        page: this.page,
      },
    });
    $.export("$summary", `Successfully sent request. Response: '${response.message}'`);
    return response;
  },
};
