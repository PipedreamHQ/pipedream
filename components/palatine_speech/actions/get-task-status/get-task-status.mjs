import app from "../../palatine_speech.app.mjs";

export default {
  key: "palatine_speech-get-task-status",
  name: "Get Task Status",
  description: "Retrieves the status and results of a transcription task. Use this to poll for completion after starting a transcription job. [See the documentation](https://docs.speech.palatine.ru/api-reference/transcribe/transcribe-polling-api/task-status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
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
    responseFormat: {
      propDefinition: [
        app,
        "responseFormat",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      taskId,
      responseFormat,
    } = this;

    const response = await app.getTaskStatus({
      $,
      taskId,
      params: {
        response_format: responseFormat,
      },
    });

    $.export("$summary", `Successfully retrieved task status as \`${response.status}\`.`);
    return response;
  },
};
