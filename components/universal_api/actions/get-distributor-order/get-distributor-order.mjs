import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-distributor-order",
  name: "Get Distributor Order",
  description:
    "Retrieve a single distributor order by ID from Universal API. Run **List Distributor Orders** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-order).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
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
    const response = await this.app.getDistributorOrder({
      $,
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved distributor order ${this.orderId}`);
    return response;
  },
};
