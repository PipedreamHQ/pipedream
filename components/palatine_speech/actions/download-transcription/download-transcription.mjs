import fs from "fs";
import path from "path";
import app from "../../palatine_speech.app.mjs";

export default {
  key: "palatine_speech-download-transcription",
  name: "Download Transcription",
  description: "Downloads the transcription results in a specified file format (SRT, VTT, TXT, CSV, or XLSX). The task must be completed before downloading. [See the documentation](https://docs.speech.palatine.ru/api-reference/transcribe/transcribe-polling-api/download-as-file)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
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
    fileFormat: {
      propDefinition: [
        app,
        "fileFormat",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of the file to save the transcription to in the `/tmp` directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      taskId,
      fileFormat,
      filename,
    } = this;

    const response = await app.downloadTranscription({
      $,
      taskId,
      params: {
        file_format: fileFormat,
      },
    });

    const filePath = path.join("/tmp", path.basename(filename));
    fs.writeFileSync(filePath, response);

    $.export("$summary", `Successfully downloaded transcription to ${filePath}`);
    return {
      filePath,
    };
  },
};
