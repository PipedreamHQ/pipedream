import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-checkouts",
  name: "List Checkouts",
  description: "Return a list of checkouts. [See the documentation](https://developer.surecart.com/api-reference/checkouts/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
    },
    groupKeys: {
      type: "string[]",
      label: "Group Keys",
      description: "Filter checkouts by group keys. Example: `[\"key_abc\"]`",
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
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    productIds: {
      propDefinition: [
        surecart,
        "productIds",
      ],
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter checkouts by status. Example: `[\"complete\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listCheckouts,
      args: {
        $,
        params: {
          "customer_ids[]": this.customerIds,
          "group_keys[]": this.groupKeys,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "product_ids[]": this.productIds,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const checkouts = [];
    for await (const checkout of results) {
      checkouts.push(checkout);
    }

    $.export("$summary", `Successfully retrieved ${checkouts.length} checkout(s)`);
    return checkouts;
  },
};
