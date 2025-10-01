import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-add-label-to-task",
  name: "Add Label To Task",
  description: "Adds a project label to a task. [See the docs](https://developers.meistertask.com/reference/post-task-label)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
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
    labelId: {
      propDefinition: [
        meistertask,
        "labelId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      label_id: this.labelId,
    };
    const response = await this.meistertask.addLabelToTask({
      $,
      taskId: this.taskId,
      data,
    });
    if (response) {
      $.export("$summary", `Successfully added label with ID ${this.labelId} to task with ID ${this.taskId}.`);
    }
    return response;
  },
};
