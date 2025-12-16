import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-list-order-notes",
  name: "List Order Notes",
  description: "Retrieve a list of notes for a specific order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-order-notes)",
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
    noteType: {
      propDefinition: [
        app,
        "noteType",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      type: this.noteType,
    };

    const response = await this.app.listOrderNotes({
      orderId: this.orderId,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.length} order note(s)`);

    return response;
  },
};
