import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-shipments",
  name: "List Shipments",
  description: "Return a list of shipments. [See the documentation](https://developer.surecart.com/api-reference/shipments/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    fulfillmentIds: {
      type: "string[]",
      label: "Fulfillment IDs",
      description: "Filter by fulfillment IDs. Use **List Fulfillments** to find fulfillment IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter shipments by status. Valid values: `draft`, `quoted`, `purchased`, `voided`. Example: `[\"draft\"]`",
      optional: true,
      options: [
        "draft",
        "quoted",
        "purchased",
        "voided",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listShipments,
      args: {
        $,
        params: {
          "fulfillment_ids[]": this.fulfillmentIds,
          "ids[]": this.ids,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const shipments = [];
    for await (const shipment of results) {
      shipments.push(shipment);
    }

    $.export("$summary", `Successfully retrieved ${shipments.length} shipment(s)`);
    return shipments;
  },
};
