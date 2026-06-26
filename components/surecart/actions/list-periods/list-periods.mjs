import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-periods",
  name: "List Periods",
  description: "Return a list of subscription billing periods. [See the documentation](https://developer.surecart.com/api-reference/periods/list)",
  version: "0.0.2",
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
    subscriptionIds: {
      type: "string[]",
      label: "Subscription IDs",
      description: "Filter by subscription IDs. Use **List Subscriptions** to find subscription IDs. Example: `[\"sub_abc123\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listPeriods({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "page": this.page,
        "subscription_ids[]": this.subscriptionIds,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} period(s)`);
    return response;
  },
};
