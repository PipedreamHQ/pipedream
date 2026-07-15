import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-trackings",
  name: "List Trackings",
  description: "Return a list of tracking records. [See the documentation](https://developer.surecart.com/api-reference/trackings/list)",
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
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listTrackings,
      args: {
        $,
        params: {
          "fulfillment_ids[]": this.fulfillmentIds,
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const trackingRecords = [];
    for await (const trackingRecord of results) {
      trackingRecords.push(trackingRecord);
    }

    $.export("$summary", `Successfully retrieved ${trackingRecords.length} tracking record(s)`);
    return trackingRecords;
  },
};
