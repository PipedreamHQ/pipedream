import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-get-order-note",
  name: "Get Order Note",
  description: "Retrieve a specific order note. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#retrieve-an-order-note)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    orderNoteId: {
      propDefinition: [
        app,
        "orderNoteId",
        ({ orderId }) => ({
          orderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrderNote({
      orderId: this.orderId,
      noteId: this.orderNoteId,
    });

    $.export("$summary", `Successfully retrieved order note ID: ${response.id}`);

    return response;
  },
};
