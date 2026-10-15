import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-workspace-ids-options",
  name: "List Workspace IDs Options",
  description: "List the account's workspaces as `{ value, label }` option pairs, to discover the `Workspace IDs` to pass to actions that filter across several workspaces, such as **List Boards**. Use when you know workspaces by name but need their IDs. Example: call with Page `1`; returns e.g. `[{ \"value\": 12345, \"label\": \"Marketing\" }]`. Returns at most `Limit` workspaces per page (25 by default), so if exactly `Limit` come back there are probably more — call again with `Page` incremented by 1. [See the documentation](https://developer.monday.com/api-reference/reference/workspaces)",
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
      description: "The page of results to retrieve, starting at `1`. Increment this to walk through workspaces when a call returns a full page of results.",
      optional: true,
      default: 1,
      min: 1,
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
    const options = await this.monday.listWorkspacesOptions({
      page: this.page,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
