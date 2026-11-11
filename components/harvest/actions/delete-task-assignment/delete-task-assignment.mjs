import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-task-assignment",
  name: "Delete Task Assignment",
  description: "Delete a task assignment from a project (only possible if it has no time entries). Use **List Task Assignments** to find IDs. Example: call with projectId and taskAssignmentId to remove that task from the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/#delete-a-task-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    await this.harvest.deleteTaskAssignment({
      $,
      projectId: this.projectId,
      taskAssignmentId: this.taskAssignmentId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted task assignment ${this.taskAssignmentId}`);
  },
};
