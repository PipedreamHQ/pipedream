import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-project-members",
  name: "List Project Members",
  description: "Lists the members of a Taskade project."
    + " Each member has a `handle` and a `displayName`."
    + " Use the `handle` values with **Assign Task** or **Create Task**."
    + " Use **List Projects** to find the project ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/projects/get-project-members)",
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
    maxResults: {
      propDefinition: [
        taskade,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.taskade.paginateByPage({
      resourceFn: this.taskade.listProjectMembers,
      args: {
        $,
        projectId: this.projectId,
      },
      max: this.maxResults,
    });
    const members = [];
    for await (const item of items) {
      members.push(item);
    }
    $.export("$summary", `Successfully retrieved ${members.length} member${members.length === 1
      ? ""
      : "s"}`);
    return members;
  },
};
