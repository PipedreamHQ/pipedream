import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-order",
  name: "Get Order",
  description: "Retrieves a single order by ID from Upsales. [See the documentation](https://api.upsales.com/#9c402e62-1951-4b50-9372-6f2664736431)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved order: ${response.description || this.orderId}`);
    return response;
  },
};

