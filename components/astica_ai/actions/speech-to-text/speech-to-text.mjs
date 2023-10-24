import asticaAi from "../../astica_ai.app.mjs";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Speech To Text",
  description: "Transcribe an audio file to text with Astica AI [See the documentation](https://astica.ai/hearing/documentation/)",
  key: "astica_ai-speech-to-text",
  version: "0.0.1",
  type: "action",
  props: {
    asticaAi,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the audio file to transcribe",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the [`/tmp` directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory) (e.g. `/tmp/myFile.csv`). Must specify either **File URL** or **File Path**.",
      optional: true,
    },
  },
  methods: {
    getFileInput(filePath) {
      const audioData = fs.readFileSync(filePath);
      const audioExtension = filePath.split(".").pop();
      return `data:audio/${audioExtension};base64,${audioData.toString("base64")}`;
    },
  },
  async run({ $ }) {
    if (!this.fileUrl && !this.filePath) {
      throw new ConfigurationError("One of File URL or File Path is required.");
    }

    const input = this.fileUrl
      ? this.fileUrl
      : this.getFileInput(this.filePath);

    const response = await this.asticaAi.speechToText({
      data: {
        input,
        modelVersion: "1.0_full",
        doStream: 0,
        low_priority: 0,
      },
      $,
    });

    if (response?.status === "success") {
      $.export("$summary", "Successfully transcribed text.");
    }

    return response;
  },
};
