import app from "../../order_desk.app.mjs";

export default {
  name: "Find Order",
  description: "Find Order [See the documentation](https://apidocs.orderdesk.com/#get-a-single-order).",
  key: "order_desk-find-order",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    order_id: {
      propDefinition: [
        app,
        "order_id",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.findOrder(this.order_id);
    $.export("summary", `Order successfully retrieved with id "${this.order_id}".`);
    return res;
  },
};
