import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-projects",
  name: "List Projects",
  description: "Lists the projects in a Taskade workspace folder."
    + " Each project has an `id`, a `name` and a `completed` flag."
    + " To list the projects of the workspace itself, use the `Home` folder."
    + " Use **List Workspaces** and **List Folders** to find the IDs."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/folders/get-folder-projects)",
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
    folderId: {
      propDefinition: [
        taskade,
        "folderId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { items = [] } = await this.taskade.listFolderProjects({
      $,
      folderId: this.folderId,
    });
    $.export("$summary", `Successfully retrieved ${items.length} project${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
