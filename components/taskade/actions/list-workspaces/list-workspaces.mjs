import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-workspaces",
  name: "List Workspaces",
  description: "Lists the Taskade workspaces of the connected user."
    + " Each workspace has an `id` and a `name`."
    + " Use the `id` with **List Folders** to find the folders of a workspace."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/workspaces/get-workspaces)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    taskade,
  },
  async run({ $ }) {
    const { items = [] } = await this.taskade.listWorkspaces({
      $,
    });
    $.export("$summary", `Successfully retrieved ${items.length} workspace${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
