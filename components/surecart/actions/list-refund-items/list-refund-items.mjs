import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-refund-items",
  name: "List Refund Items",
  description: "Return a list of refund items. [See the documentation](https://developer.surecart.com/api-reference/refund-items/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,

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
    refundIds: {
      type: "string[]",
      label: "Refund IDs",
      description: "Filter by refund IDs. Use **List Refunds** to find refund IDs. Example: `[\"ref_abc123\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listRefundItems({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
        "refund_ids[]": this.refundIds,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} refund item(s)`);
    return response;
  },
};
