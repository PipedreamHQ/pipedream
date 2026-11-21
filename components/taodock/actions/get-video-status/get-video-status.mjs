import app from "../../taodock.app.mjs";
import {
  extractTaskId,
  extractTaskStatus,
} from "../../common/payloads.mjs";

export default {
  key: "taodock-get-video-status",
  name: "Get Video Status",
  description:
    "Check the current status of a Taodock video generation task. [See the documentation](https://docs.taodock.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  type: "action",
  props: {
    app,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the video task returned by Create Video.",
    },
  },
  async run({ $ }) {
    const taskId = this.taskId.trim();
    const task = await this.app.getVideoTask({
      $,
      taskId,
    });
    const status = extractTaskStatus(task);
    $.export("$summary", `Video task \`${taskId}\` status: ${status}`);
    return {
      ...(task && typeof task === "object"
        ? task
        : {}),
      task_id: extractTaskId(task) || taskId,
      status,
    };
  },
};
