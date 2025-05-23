import fs from "fs";
import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-convert-text-to-speech",
  name: "Convert Text to Speech (TTS)",
  description: "Generates audio from the input text. [See the documentation](https://apipie.ai/docs/Features/Voices)",
  version: "0.0.1",
  type: "action",
  props: {
    apipieAi,
    model: {
      propDefinition: [
        apipieAi,
        "ttsModelId",
      ],
      reloadProps: true,
    },
    input: {
      propDefinition: [
        apipieAi,
        "input",
      ],
    },
    responseFormat: {
      propDefinition: [
        apipieAi,
        "audioResponseFormat",
      ],
    },
    speed: {
      propDefinition: [
        apipieAi,
        "speed",
      ],
    },
    outputFile: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the output audio file that will be written to the `/tmp` folder, e.g. `/tmp/myFile.mp3`",
    },
  },
  async additionalProps() {
    const props = {};
    if (this.model) {
      const { data } = await this.apipieAi.listVoices({ model: this.model });
      const uniqueVoices = new Map();
      data.forEach(({ voice_id, name, description }) => {
        if (!uniqueVoices.has(voice_id)) {
          uniqueVoices.set(voice_id, { name, description });
        }
      });
      props.voice = {
        type: "string",
        label: "Voice",
        description: "The voice to use when generating the audio.",
        options: Array.from(uniqueVoices.entries())
          .map(([value, { name, description }]) => ({
            label: description ? `${name} - ${description}` : name,
            value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.apipieAi.createSpeech({
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
