import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-add-order-note",
  name: "Add Order Note",
  description: "Create a new note for an order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#create-an-order-note)",
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
    note: {
      type: "string",
      label: "Note",
      description: "Order note content",
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      note,
    } = this;

    const response = await app.createOrderNote({
      $,
      orderId,
      data: {
        note,
      },
    });

    $.export("$summary", `Successfully created order note with ID \`${response.id}\``);

    return response;
  },
};
