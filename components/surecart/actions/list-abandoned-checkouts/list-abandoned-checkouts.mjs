import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-abandoned-checkouts",
  name: "List Abandoned Checkouts",
  description: "Return a list of abandoned checkouts. [See the documentation](https://developer.surecart.com/api-reference/abandonded-checkouts/list)",
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
