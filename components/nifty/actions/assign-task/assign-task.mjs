import nifty from "../../nifty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nifty-assign-task",
  name: "Assign Task to Team Member",
  description: "Assigns a specific task to a team member in Nifty. [See the documentation](https://openapi.niftypm.com/api#put-api-v1-0-tasks-task_id-assignees)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nifty,
    taskId: {
      propDefinition: [
        nifty,
        "taskId",
      ],
    },
    taskAssigneeId: {
      propDefinition: [
        nifty,
        "taskAssigneeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nifty.assignTask({
      taskId: this.taskId,
      taskAssigneeId: this.taskAssigneeId,
    });

    $.export("$summary", `Successfully assigned task ${this.taskId} to team member ${this.taskAssigneeId}`);
    return response;
  },
};
