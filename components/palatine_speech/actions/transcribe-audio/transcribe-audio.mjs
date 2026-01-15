import FormData from "form-data";
import {
  getFileStreamAndMetadata,
  ConfigurationError,
} from "@pipedream/platform";
import app from "../../palatine_speech.app.mjs";

export default {
  key: "palatine_speech-transcribe-audio",
  name: "Transcribe Audio",
  description: "Starts an asynchronous transcription job for an audio or video file. Optionally wait for completion by enabling the 'Wait for Completion' option. [See the documentation](https://docs.speech.palatine.ru/api-reference/transcribe/transcribe-polling-api/transcribe)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.mp3`)",
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    fastInference: {
      propDefinition: [
        app,
        "fastInference",
      ],
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "If enabled, the action will poll the task status until the transcription is complete before returning the result",
      optional: true,
    },
    pollingInterval: {
      type: "integer",
      label: "Polling Interval (seconds)",
      description: "Time to wait between status checks when waiting for completion. Only used if **Wait for Completion** is enabled. Defaults to `3` seconds if not specified.",
      optional: true,
      min: 1,
      max: 60,
    },
    maxPollingAttempts: {
      type: "integer",
      label: "Max Polling Attempts",
      description: "Maximum number of times to check the status before timing out. Only used if **Wait for Completion** is enabled. Defaults to `3` attempts if not specified.",
      optional: true,
      min: 1,
      max: 20,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      filePath,
      model,
      fastInference,
      waitForCompletion,
      pollingInterval = 3,
      maxPollingAttempts = 3,
    } = this;

    const data = new FormData();

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(filePath);

    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await app.transcribeAudio({
      $,
      headers: data.getHeaders(),
      params: {
        model,
        fast_inference: fastInference,
      },
      data,
    });

    const taskId = response.task_id;

    if (!waitForCompletion) {
      $.export("$summary", "Successfully started transcription job");
      return response;
    }

    // Poll for completion
    let attempts = 0;
    let taskStatus;

    while (attempts < maxPollingAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollingInterval * 1000));

      taskStatus = await app.getTaskStatus({
        $,
        taskId,
      });

      if (taskStatus.status === "success") {
        $.export("$summary", "Transcription completed successfully");
        return taskStatus;
      }

      if (taskStatus.status === "error") {
        throw new ConfigurationError(`Transcription failed: ${taskStatus.error || "Unknown error"}`);
      }

      attempts++;
    }

    throw new ConfigurationError(`Transcription timed out after ${maxPollingAttempts} attempts`);
  },
};
