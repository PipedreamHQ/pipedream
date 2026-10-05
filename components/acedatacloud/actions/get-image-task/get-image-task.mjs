import acedatacloud, {
  apiError, taskState,
} from "../../acedatacloud.app.mjs";

export default {
  key: "acedatacloud-get-image-task",
  name: "Get Image Task",
  description: "Retrieve a submitted Seedream task without starting another image job. [See the documentation](https://platform.acedata.cloud/documents/seedream-tasks)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task ID from Generate Image or Edit Image. Reusing it does not submit another generation job.",
    },
  },
  async run({ $ }) {
    if (typeof this.taskId !== "string" || !this.taskId.trim()) {
      throw new Error("Task ID is required.");
    }
    let response;
    try {
      response = await this.acedatacloud.getImageTask({
        $,
        taskId: this.taskId.trim(),
      });
    } catch (error) {
      throw apiError(error);
    }
    const state = taskState(response);
    $.export("$summary", `Image task ${this.taskId.trim()}: ${state}`);
    return {
      ...response,
      state,
    };
  },
};
