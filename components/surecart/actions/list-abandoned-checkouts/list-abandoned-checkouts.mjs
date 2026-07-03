import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-abandoned-checkouts",
  name: "List Abandoned Checkouts",
  description: "Return a list of abandoned checkouts. [See the documentation](https://developer.surecart.com/api-reference/abandonded-checkouts/list)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
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
    notificationStatus: {
      type: "string[]",
      label: "Notification Status",
      description: "Filter by notification status. Example: `[\"sent\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listAbandonedCheckouts,
      args: {
        $,
        params: {
          "customer_ids[]": this.customerIds,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "notification_status[]": this.notificationStatus,
        },
      },
      max: this.maxResults,
    });

    const abandonedCheckouts = [];
    for await (const abandonedCheckout of results) {
      abandonedCheckouts.push(abandonedCheckout);
    }

    $.export("$summary", `Successfully retrieved ${abandonedCheckouts.length} abandoned checkout(s)`);
    return abandonedCheckouts;
  },
};
