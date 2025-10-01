import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-get-task",
  name: "Get Task",
  description: "Retrieves information about a task. [See the docs](https://developers.meistertask.com/reference/get-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
      optional: true,
    },
    sectionId: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        meistertask,
        "taskId",
        (c) => ({
          projectId: c.projectId,
          sectionId: c.sectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meistertask.getTask({
      taskId: this.taskId,
      $,
    });
    if (response) {
      $.export("$summary", `Successfully retrieved task with ID ${this.taskId}`);
    }
    return response;
  },
};
