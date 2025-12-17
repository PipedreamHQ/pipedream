import app from "../../picqer.app.mjs";

export default {
  key: "picqer-cancel-order",
  name: "Cancel Order",
  description: "Removes orders with 'concept' or 'expected' status only. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
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
    force: {
      type: "boolean",
      label: "Force Cancel",
      description: "If enabled, cancels orders regardless of status, removing attached picklists even if picked",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      force,
    } = this;

    await app.cancelOrder({
      $,
      orderId,
      params: {
        force,
      },
    });
    $.export("$summary", "Successfully canceled order");
    return {
      success: true,
    };
  },
};
