import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "List the account's workspaces as `{ value, label }` option pairs, to discover a `Workspace ID` to pass to **Create Board** or to filter **List Boards**. Use when you know a workspace by name but need its ID. Example: call with Page `0`; returns e.g. `[{ \"value\": 12345, \"label\": \"Marketing\" }]`. Returns at most `Limit` workspaces per page (25 by default), so if exactly `Limit` come back there are probably more — call again with `Page` incremented by 1. [See the documentation](https://developer.monday.com/api-reference/reference/workspaces)",
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
      description: "The page of results to retrieve, starting at `0`. Increment this to walk through workspaces when a call returns a full page of `Limit` results.",
      min: 0,
      default: 0,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of workspaces to return per page. Defaults to 25. If exactly this many are returned there are probably more, so call again with `Page` incremented by 1.",
      optional: true,
      default: 25,
      min: 1,
    },
  },
  async run({ $ }) {
    const options = await monday.propDefinitions.workspaceId.options.call(this.monday, {
      page: this.page,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
