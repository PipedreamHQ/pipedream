import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-shipments",
  name: "List Shipments",
  description: "Return a list of shipments. [See the documentation](https://developer.surecart.com/api-reference/shipments/list)",
  version: "0.0.2",
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
      description: "Filter by fulfillment IDs. Use **List Fulfillments** to find fulfillment IDs. Example: `[\"ful_abc123\"]`",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    limit: {
      propDefinition: [
        surecart,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        surecart,
        "page",
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
    const response = await this.surecart.listShipments({
      $,
      params: {
        "fulfillment_ids[]": this.fulfillmentIds,
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
        "status[]": this.status,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} shipment(s)`);
    return response;
  },
};
