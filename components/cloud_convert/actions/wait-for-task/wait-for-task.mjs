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
  props: {
    app,
    taskId: {
      description: "The ID of the task to wait for",
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
