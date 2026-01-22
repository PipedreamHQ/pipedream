import app from "../../palatine_speech.app.mjs";

export default {
  key: "palatine_speech-mark-task-done",
  name: "Mark Task Done",
  description: "Marks a transcription task as completed and removes it from the list of active tasks. Use this to clean up resources after retrieving results. [See the documentation](https://docs.speech.palatine.ru/api-reference/transcribe/transcribe-polling-api/task-done)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      taskId,
    } = this;

    const response = await app.markTaskDone({
      $,
      taskId,
    });

    $.export("$summary", "Successfully marked task as done");
    return response;
  },
};
