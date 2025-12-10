import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-add-order-comment",
  name: "Add Comment To Order",
  description: "Add a comment to an order in Picqer. [See the documentation](https://picqer.com/en/api/comments#adding-comments-to-an-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    picqer,
    orderId: {
      propDefinition: [
        picqer,
        "orderId",
      ],
    },
    body: {
      propDefinition: [
        picqer,
        "commentBody",
      ],
    },
    showAtRelated: {
      propDefinition: [
        picqer,
        "showAtRelated",
      ],
    },
    isVisibleFulfillment: {
      propDefinition: [
        picqer,
        "isVisibleFulfillment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.addOrderComment({
      $,
      orderId: this.orderId,
      data: {
        body: this.body,
        show_at_related: this.showAtRelated,
        is_visible_fulfilment: this.isVisibleFulfillment,
      },
    });

    $.export("$summary", `Successfully added comment to order ${this.orderId}`);
    return response;
  },
};
