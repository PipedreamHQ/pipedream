import motion from "../../motion.app.mjs";

export default {
  key: "motion-get-task",
  name: "Retrieve Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a specific task by Id. [See the documentation](https://docs.usemotion.com/docs/motion-rest-api/3e8c65ed58693-retrieve-a-task)",
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

    const response = await motion.getTask({
      $,
      taskId,
    });

    $.export("$summary", `The task with Id: ${taskId} was successfully fetched!`);
    return response;
  },
};
