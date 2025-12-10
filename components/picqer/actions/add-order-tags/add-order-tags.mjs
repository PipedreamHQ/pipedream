import app from "../../picqer.app.mjs";

export default {
  key: "picqer-add-order-tags",
  name: "Add Order Tags",
  description: "Associates a tag with an order. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    tagId: {
      propDefinition: [
        app,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addOrderTags({
      $,
      orderId: this.orderId,
      data: {
        idtag: this.tagId,
      },
    });

    $.export("$summary", `Successfully added tag to order ${this.orderId}`);
    return response;
  },
};
