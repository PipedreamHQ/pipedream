import trunkrs from "../../trunkrs.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "trunkrs-list-shipments",
  name: "List Shipments",
  description: "List all shipments. [See the documentation](https://docs.trunkrs.nl/docs/v2-api-documentation/b425314ab6c67-list-shipments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    trunkrs,
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort by. Fields prepended with a dash (-) are sorted in descending order.",
      options: constants.SHIPMENT_SORT_FIELDS,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of shipments to return. Default: 100",
      default: 100,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset to start from. Default: 0",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.trunkrs.paginate({
      fn: this.trunkrs.listShipments,
      args: {
        $,
        params: {
          sort: this.sort,
          offset: this.offset,
        },
      },
      max: this.maxResults,
    });

    const shipments = [];
    for await (const shipment of results) {
      shipments.push(shipment);
    }
    $.export("$summary", `Successfully fetched ${shipments.length} shipments.`);
    return shipments;
  },
};
