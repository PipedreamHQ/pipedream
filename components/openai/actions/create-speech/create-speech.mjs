import openai from "../../openai.app.mjs";
import fs from "fs";
import { file } from "tmp-promise";

export default {
  key: "openai-create-speech",
  name: "Create Speech",
  description: "Generates audio from the input text. [See the documentation](https://platform.openai.com/docs/api-reference/audio/createSpeech)",
  version: "0.0.1",
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
      description: "The filename of the output audio file that will be written to the `/tmp` folder, e.g. `myFile.mp3`",
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
    });

    const outputFilePath = this.outputFile.includes("tmp/")
      ? this.outputFile
      : `/tmp/${this.outputFile}`;

    const { cleanup } = await file();
    await fs.promises.appendFile(outputFilePath, Buffer.from(response));
    await cleanup();

    $.export("$summary", "Generated audio successfully");
    return {
      outputFilePath,
      response,
    };
  },
};
