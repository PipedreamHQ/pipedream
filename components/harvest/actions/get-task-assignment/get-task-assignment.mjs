import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-task-assignment",
  name: "Get Task Assignment",
  description: "Retrieve a single task assignment on a project. Use **List Task Assignments** to find IDs. Example: call with projectId and taskAssignmentId to check whether that task is billable on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/#retrieve-a-task-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    taskAssignmentId: {
      propDefinition: [
        harvest,
        "taskAssignmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.getTaskAssignment({
      $,
      projectId: this.projectId,
      taskAssignmentId: this.taskAssignmentId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved task assignment ${response.id}`);
    return response;
  },
};
