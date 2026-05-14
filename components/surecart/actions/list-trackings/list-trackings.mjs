import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-trackings",
  name: "List Trackings",
  description: "Return a list of tracking records. [See the documentation](https://developer.surecart.com/api-reference/trackings/list)",
  version: "0.0.1",
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
      type: "string[]",
      label: "IDs",
      description: "Filter by specific IDs. Example: `[\"id_abc123\", \"id_def456\"]`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return per page (1-100). Example: `25`",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listTrackings({
      $,
      params: {
        "fulfillment_ids[]": this.fulfillmentIds,
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} tracking record(s)`);
    return response;
  },
};
