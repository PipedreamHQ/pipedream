import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-refund-items",
  name: "List Refund Items",
  description: "Return a list of refund items. [See the documentation](https://developer.surecart.com/api-reference/refund-items/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,

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
    refundIds: {
      type: "string[]",
      label: "Refund IDs",
      description: "Filter by refund IDs. Use **List Refunds** to find refund IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listRefundItems,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "refund_ids[]": this.refundIds,
        },
      },
      max: this.maxResults,
    });

    const refundItems = [];
    for await (const refundItem of results) {
      refundItems.push(refundItem);
    }

    $.export("$summary", `Successfully retrieved ${refundItems.length} refund item(s)`);
    return refundItems;
  },
};
