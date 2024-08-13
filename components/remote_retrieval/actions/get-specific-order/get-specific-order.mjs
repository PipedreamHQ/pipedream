import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-get-specific-order",
  name: "Get Specific Order",
  description: "Fetches a single device return order. [See the documentation](https://www.remoteretrieval.com/api-documentation/#order-detail)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    oid: {
      propDefinition: [
        app,
        "oid",
      ],
    },
  },
  async run({ $ }) {
    const { oid } = this;
    const response = await this.app.getOrder({
      $,
      oid,
    });

    $.export("$summary", `Successfully retrieved order with ID \`${this.oid}\`.`);

    return response;
  },
};
