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
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    distributorServiceId: {
      propDefinition: [
        app,
        "distributorServiceId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getDistributorOrder({
      $,
      consumerId: this.consumerId,
      orderId: this.orderId,
      serviceId: this.distributorServiceId,
    });
    $.export("$summary", `Successfully retrieved distributor order ${this.orderId}`);
    return response;
  },
};
