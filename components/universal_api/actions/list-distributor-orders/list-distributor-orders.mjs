import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-distributor-orders",
  name: "List Distributor Orders",
  description:
    "List orders from the Distributors API on Universal API. Returns an array; use the returned IDs with **Get Distributor Order**. This hits a different endpoint than **List Asset Management Orders**. [See the documentation](https://docs.universalapi.io/reference/list-orders-1).",
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
    serviceId: {
      propDefinition: [
        app,
        "distributorServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listDistributorOrders({
      $,
      consumerId: this.consumerId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} distributor order(s)`);
    return response;
  },
};
