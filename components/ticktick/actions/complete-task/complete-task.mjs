import ticktick from "../../ticktick.app.mjs";

export default {
  key: "ticktick-complete-task",
  name: "Complete a Task",
  description: "Complete a Task.[See doc](https://developer.ticktick.com/api#/openapi?id=complete-task)",
  version: "0.0.1",
  type: "action",
  props: {
    ticktick,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "ID of task to complete",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Project ID",
      default: "inbox",
    },
  },
  async run({ $ }) {
    const {
      taskId, projectId,
    } = this;
    const response = await this.ticktick.completeTask({
      $,
      taskId,
      projectId,
    });
    $.export("$summary", "Successfully completed task");
    return response;
  },
};
