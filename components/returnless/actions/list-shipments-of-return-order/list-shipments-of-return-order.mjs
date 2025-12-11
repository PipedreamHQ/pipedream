import app from "../../returnless.app.mjs";

export default {
  key: "returnless-list-shipments-of-return-order",
  name: "List Shipments of Return Order",
  description: "List all shipments of a return order. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/1e0748fdd876f-list-all-shipments-of-a-return-order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    returnOrderId: {
      propDefinition: [
        app,
        "returnOrderId",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const resources = await this.app.getPaginatedResources({
      fn: this.app.listReturnOrderShipments,
      args: {
        returnOrderId: this.returnOrderId,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${resources.length} shipment(s) for return order ${this.returnOrderId}`);
    return resources;
  },
};
