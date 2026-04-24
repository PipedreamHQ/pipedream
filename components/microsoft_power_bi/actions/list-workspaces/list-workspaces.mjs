import app from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-list-workspaces",
  name: "List Workspaces",
  description: "List the Power BI workspaces (groups) the authenticated user can access."
    + " Use this tool first whenever the user refers to a workspace by name — it returns the `id` you need to pass as `workspaceId` to other tools."
    + " Power BI has no `/me` endpoint, so the set of accessible workspaces is the user's primary context (the 'who am I' signal for this app)."
    + " Every item in the response includes `id`, `name`, `isReadOnly`, `isOnDedicatedCapacity`, and `type`."
    + " Note: when a user says 'my workspace' without a name, they may mean personal My workspace (implicit — pass no `workspaceId` to other tools) OR a specific named workspace — ask only if ambiguous."
    + " [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/groups/get-groups)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const groups = await this.app.listGroups({
      $,
    });
    $.export("$summary", `Found ${groups.length} workspace${groups.length === 1
      ? ""
      : "s"}`);
    return groups;
  },
};
