import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-get-scout-updates",
  name: "Get Scout Updates",
  description: "Fetch the latest findings from a specific Yutori Scout. Returns updates in reverse chronological order. Use the **New Scout Update** trigger for event-driven workflows; use this action when you need to pull findings on demand. [See the documentation](https://docs.yutori.com/reference/scouting-updates-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    yutori,
    scoutId: {
      type: "string",
      label: "Scout ID",
      description: "The ID of the scout whose updates to fetch, e.g. from the Yutori dashboard or a previous **Get Scout** step",
    },
    pageSize: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of updates to return (1–100)",
      optional: true,
      default: 10,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.pageSize) params.page_size = this.pageSize;

    const result = await this.yutori.getScoutUpdates($, this.scoutId, params);
    const updates = result?.updates ?? result?.items ?? [];
    const count = Array.isArray(updates)
      ? updates.length
      : "?";

    $.export("$summary", `Retrieved ${count} update${count === 1
      ? ""
      : "s"} for scout ${this.scoutId}`);
    return result;
  },
};
