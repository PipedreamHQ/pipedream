import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-list-workspaces",
  name: "List Workspaces",
  description: "Lists all [Linkly](https://linklyhq.com) workspaces accessible to the authenticated user. Useful for finding the workspace ID required for [API requests](https://linklyhq.com/url-shortener-api).",
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
    $.export("$summary", `Successfully fetched ${workspaces?.length ?? 0} workspace${workspaces?.length === 1 ? "" : "s"}.`);
    return workspaces;
  },
};
