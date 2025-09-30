import asticaAi from "../../astica_ai.app.mjs";
import constants from "../../common/constants.mjs";
import fs from "fs";

export default {
  name: "Text To Speech",
  description: "Convert text to voice audio with Astica AI [See the documentation](https://astica.ai/voice/documentation/)",
  key: "astica_ai-text-to-speech",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asticaAi,
    text: {
      type: "string",
      label: "Text",
      description: "The text to be spoken",
    },
    filename: {
      type: "string",
      label: "Target Filename",
      description: "The filename that will be used to save in /tmp",
    },
    language: {
      type: "string",
      label: "Language / Dialect",
      description: "Select the language/dialect to use",
      options: constants.LANGUAGES,
      default: "us-EN",
      optional: true,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "Select the voice to use",
      options() {
        return constants.VOICES[this.language];
      },
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.asticaAi.textToSpeech({
      data: {
        input: this.text,
        lang: this.language,
        voice: this.voice,
        modelVersion: "1.0_full",
      },
      $,
    });

    if (response?.status === "success") {
      const wavBuffer = new Buffer.from(response.wavBuffer.data);
      const filePath = `/tmp/${this.filename}`;
      fs.writeFileSync(filePath, wavBuffer);

      $.export("$summary", "Successfully converted text to speech.");

      return {
        filename: this.filename,
        filePath,
        response,
      };
    }

    return response;
  },
};
