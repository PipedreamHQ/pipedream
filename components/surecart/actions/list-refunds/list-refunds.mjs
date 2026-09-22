import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-refunds",
  name: "List Refunds",
  description: "Return a list of refunds. [See the documentation](https://developer.surecart.com/api-reference/refunds/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    chargeIds: {
      type: "string[]",
      label: "Charge IDs",
      description: "Filter by charge IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
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
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    returnRequestIds: {
      type: "string[]",
      label: "Return Request IDs",
      description: "Filter by return request IDs. Use **List Return Requests** to find return request IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listRefunds,
      args: {
        $,
        params: {
          "charge_ids[]": this.chargeIds,
          "customer_ids[]": this.customerIds,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "return_request_ids[]": this.returnRequestIds,
        },
      },
      max: this.maxResults,
    });

    const refunds = [];
    for await (const refund of results) {
      refunds.push(refund);
    }

    $.export("$summary", `Successfully retrieved ${refunds.length} refund(s)`);
    return refunds;
  },
};
