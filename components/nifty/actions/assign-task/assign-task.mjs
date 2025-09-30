import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-assign-task",
  name: "Assign Task to Team Member",
  description: "Assigns a specific task to a team member in Nifty. [See the documentation](https://openapi.niftypm.com/api#put-api-v1-0-tasks-task_id-assignees)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nifty,
    taskId: {
      propDefinition: [
        nifty,
        "taskId",
      ],
    },
    assignees: {
      propDefinition: [
        nifty,
        "memberId",
      ],
      type: "string[]",
    },
  },
  async run({ $ }) {
    const response = await this.nifty.assignTask({
      $,
      taskId: this.taskId,
      data: {
        assignees: this.assignees,
      },
    });

    $.export("$summary", `Successfully assigned task ${this.taskId} to team member(s) with Id(s): ${this.assignees.toString()}`);
    return response;
  },
};
