import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-cancellation-acts",
  name: "List Cancellation Acts",
  description: "Return a list of cancellation acts. [See the documentation](https://developer.surecart.com/api-reference/cancellation-acts/list)",
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
    liveMode: {
      type: "boolean",
      label: "Live Mode",
      description: "Filter by live mode (`true`) or test mode (`false`).",
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
    const response = await this.surecart.listCancellationActs({
      $,
      params: {
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} cancellation act(s)`);
    return response;
  },
};
