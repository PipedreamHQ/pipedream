import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-board-ids-options",
  name: "List Board IDs Options",
  description: "List the account's boards as `{ value, label }` option pairs, to discover the `Board IDs` to pass to actions that filter across several boards, such as **List Boards**. Use when you know boards by name but need their IDs. Example: call with Page `1`; returns e.g. `[{ \"value\": \"2419687965\", \"label\": \"Q3 Campaigns\" }]`. Returns at most 25 options per page, so if exactly 25 come back there are probably more — call again with `Page` incremented by 1. Sub-items boards are excluded. [See the documentation](https://developer.monday.com/api-reference/reference/boards)",
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
      description: "The page of results to retrieve, starting at `1`. Increment this to walk through boards when a call returns a full page of results.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const options = await this.monday.listBoardsOptions({
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
