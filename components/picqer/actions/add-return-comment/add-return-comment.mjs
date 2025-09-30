import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-add-return-comment",
  name: "Add Comment To Return",
  description: "Add a comment to a return in Picqer. [See the documentation](https://picqer.com/en/api/comments#add-a-comment-to-an-return)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    picqer,
    returnId: {
      propDefinition: [
        picqer,
        "returnId",
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
    const response = await this.picqer.addReturnComment({
      $,
      returnId: this.returnId,
      data: {
        body: this.body,
        show_at_related: this.showAtRelated,
        is_visible_fulfilment: this.isVisibleFulfillment,
      },
    });

    $.export("$summary", `Successfully added comment to return ${this.returnId}`);
    return response;
  },
};
