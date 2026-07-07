import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-periods",
  name: "List Periods",
  description: "Return a list of subscription billing periods. [See the documentation](https://developer.surecart.com/api-reference/periods/list)",
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
    subscriptionIds: {
      type: "string[]",
      label: "Subscription IDs",
      description: "Filter by subscription IDs. Use **List Subscriptions** to find subscription IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listPeriods,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "subscription_ids[]": this.subscriptionIds,
        },
      },
      max: this.maxResults,
    });

    const periods = [];
    for await (const period of results) {
      periods.push(period);
    }

    $.export("$summary", `Successfully retrieved ${periods.length} period(s)`);
    return periods;
  },
};
