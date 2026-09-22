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
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listOrders({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
        probability: 100,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.data?.length || 0} order${response?.data?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

