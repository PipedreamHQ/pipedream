import app from "../../taodock.app.mjs";

export default {
  key: "taodock-download-video",
  name: "Download Video",
  description:
    "Download the finished video file of a completed Taodock video task as base64. [See the documentation](https://docs.taodock.com)",
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
      description: "The ID of the completed video task.",
    },
  },
  async run({ $ }) {
    const taskId = this.taskId.trim();
    const response = await this.app.downloadVideoContent({
      $,
      taskId,
    });

    const header = response?.headers?.["content-type"];
    const mimeType = (Array.isArray(header) ? header[0] : header)?.split(";")[0] || "video/mp4";
    const buffer = Buffer.isBuffer(response?.data)
      ? response.data
      : Buffer.from(response?.data ?? new ArrayBuffer(0));
    const fileName = `${taskId}.mp4`;

    $.export(
      "$summary",
      `Downloaded video \`${fileName}\` (${mimeType}, ${(buffer.length / 1024 / 1024).toFixed(2)} MB)`,
    );
    return {
      task_id: taskId,
      fileName,
      mimeType,
      sizeBytes: buffer.length,
      video_base64: buffer.toString("base64"),
    };
  },
};
