import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-order-list",
  name: "Get Order List",
  description: "Retrieves a list of orders from Upsales. [See the documentation](https://api.upsales.com/#9c402e62-1951-4b50-9372-6f2664736431)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listOrders({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length || 0} order(s)`);
    return response;
  },
};

