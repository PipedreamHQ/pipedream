import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-board-id-options",
  name: "List Board ID Options",
  description: "List the account's boards as `{ value, label }` option pairs, to discover a `Board ID` to pass to other actions. Use when you know a board by name but need its ID; use **List Boards** when you want each board's full details instead. Example: call with Page `0`; returns e.g. `[{ \"value\": \"2419687965\", \"label\": \"Q3 Campaigns\" }]`. Returns at most 25 options per page, so if exactly 25 come back there are probably more — call again with `Page` incremented by 1. Sub-items boards are excluded. [See the documentation](https://developer.monday.com/api-reference/reference/boards)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await monday.propDefinitions.boardId.options.call(this.monday, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
