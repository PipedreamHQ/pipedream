import fs from "fs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-speech",
  name: "Create Speech (TTS)",
  description: "Generates audio from the input text. [See the documentation](https://platform.openai.com/docs/api-reference/audio/createSpeech)",
  version: "0.0.5",
  type: "action",
  props: {
    openai,
    model: {
      propDefinition: [
        openai,
        "ttsModel",
      ],
    },
    input: {
      propDefinition: [
        openai,
        "input",
      ],
    },
    voice: {
      propDefinition: [
        openai,
        "voice",
      ],
    },
    responseFormat: {
      propDefinition: [
        openai,
        "responseFormat",
      ],
    },
    speed: {
      propDefinition: [
        openai,
        "speed",
      ],
    },
    outputFile: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the output audio file that will be written to the `/tmp` folder, e.g. `/tmp/myFile.mp3`",
    },
  },
  async run({ $ }) {
    const response = await this.openai.createSpeech({
      $,
      data: {
        model: this.model,
        input: this.input,
        voice: this.voice,
        response_format: this.responseFormat,
        speed: Number(this.speed),
      },
      responseType: "arraybuffer",
    });

    const outputFilePath = this.outputFile.includes("tmp/")
      ? this.outputFile
      : `/tmp/${this.outputFile}`;

    await fs.promises.writeFile(outputFilePath, Buffer.from(response));

    $.export("$summary", "Generated audio successfully");
    return {
      outputFilePath,
      response,
    };
  },
};
