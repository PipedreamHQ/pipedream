import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-list-workspaces",
  name: "List Workspaces",
  description: "List all workspaces the API key has access to via `GET /api/v1/workspaces`. Useful for finding the workspace ID required for API requests. [See the documentation](https://app.linklyhq.com/swaggerui#/Workspaces/listWorkspaces).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linkly,
  },
  async run({ $ }) {
    const workspaces = await this.linkly.listWorkspaces({
      $,
    });
    $.export("$summary", `Successfully fetched ${workspaces?.length ?? 0} workspace${workspaces?.length === 1
      ? ""
      : "s"}.`);
    return workspaces;
  },
};
