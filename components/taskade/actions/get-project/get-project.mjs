import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-get-project",
  name: "Get Project",
  description: "Gets a Taskade project by ID."
    + " Returns the project `id`, `name`, `icon` and `completed` flag."
    + " To read the tasks of the project, use **List Tasks**."
    + " Use **List Projects** to find the project ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/projects/get-project)",
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
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taskade.getProject({
      $,
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully retrieved project with ID ${this.projectId}`);
    return response;
  },
};
