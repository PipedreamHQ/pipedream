import ticktick from "../../ticktick.app.mjs";

export default {
  key: "ticktick-complete-task",
  name: "Complete a Task",
  description: "Complete a Task. [See doc](https://developer.ticktick.com/api#/openapi?id=complete-task)",
  version: "0.0.2",
  type: "action",
  props: {
    ticktick,
    projectId: {
      propDefinition: [
        ticktick,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        ticktick,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
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
