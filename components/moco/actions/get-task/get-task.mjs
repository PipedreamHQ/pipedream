import moco from "../../moco.app.mjs";

export default {
  key: "moco-get-task",
  name: "Get Task",
  description: "Gets a task by ID. [See the documentation](https://everii-group.github.io/mocoapp-api-docs/sections/project_tasks.html#get-projectsidtasksid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moco,
    projectId: {
      propDefinition: [
        moco,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        moco,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.moco.getTask({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
    });

    $.export("$summary", `Successfully retrieved task with ID: ${this.taskId}`);
    return response;
  },
};
