import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-create-project",
  name: "Create Project",
  description: "Creates a new Taskade project in a workspace folder from Markdown content."
    + " To create the project in the workspace itself, use the `Home` folder."
    + " Use **List Workspaces** and **List Folders** to find the IDs."
    + " To add tasks later, use **Create Task** with the returned project ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/projects/create-project)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    content: {
      type: "string",
      label: "Content",
      description: "The project as Markdown, e.g. `# Launch Plan\\n- Write the announcement\\n- Update the website`.",
    },
  },
  async run({ $ }) {
    const response = await this.taskade.createProject({
      $,
      data: {
        folderId: this.folderId,
        contentType: "text/markdown",
        content: this.content,
      },
    });
    $.export("$summary", `Successfully created project with ID ${response.item?.id}`);
    return response;
  },
};
