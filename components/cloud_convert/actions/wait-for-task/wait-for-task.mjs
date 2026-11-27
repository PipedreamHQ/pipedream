import app from "../../cloud_convert.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cloud_convert-wait-for-task",
  name: "Wait for Task",
  description: "Waits until a task has finished and returns it. For `export/url` tasks the output file URLs are available in `result.files`. Throws if the task failed. Not recommended for long-running tasks, use a webhook or the **Job Finished (Instant)** source instead. [See the documentation](https://cloudconvert.com/api/v2/tasks#tasks-wait)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    taskId: {
      description: "The ID of the task to wait for, e.g. `5a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d`. Use **Get Job** and read `data.tasks[].id`, or use the `data.id` returned by **Create Import URL Task**.",
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.waitForTask({
      $,
      taskId: this.taskId,
    });

    utils.throwIfFailed("task", response.data);

    $.export("$summary", `Task \`${response.data.id}\` finished with status \`${response.data.status}\``);
    return response;
  },
};
