import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-folders",
  name: "List Folders",
  description: "Lists the folders of a Taskade workspace."
    + " Each folder has an `id` and a `name`. The first item is the `Home` folder, which has the same ID as the workspace."
    + " Use the `id` with **List Projects**, **Create Project** or **List Agents**."
    + " Use **List Workspaces** to find the workspace ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/workspaces/get-folders)",
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
    workspaceId: {
      propDefinition: [
        taskade,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const { items = [] } = await this.taskade.listFolders({
      $,
      workspaceId: this.workspaceId,
    });
    $.export("$summary", `Successfully retrieved ${items.length} folder${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
