import motion from "../../motion.app.mjs";

export default {
  key: "motion-delete-task",
  name: "Delete Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a specific task by Id. [See the documentation](https://docs.usemotion.com/docs/motion-rest-api/963b35f93846f-delete-a-task)",
  type: "action",
  props: {
    motion,
    taskId: {
      propDefinition: [
        motion,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const {
      motion,
      taskId,
    } = this;

    const response = await motion.deleteTask({
      $,
      taskId,
    });

    $.export("$summary", `The task with Id: ${taskId} was successfully deleted!`);
    return response;
  },
};
