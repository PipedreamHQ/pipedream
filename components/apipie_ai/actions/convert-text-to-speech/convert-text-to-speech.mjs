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
      // Parse the model JSON to get id and route
      const modelData = JSON.parse(this.model);
      const { route } = modelData;
      
      // Get all voices and filter by the model route
      const { data } = await this.apipieAi.listVoices();
      const filteredVoices = data.filter(voice => voice.model === route);
      
      const uniqueVoices = new Map();
      filteredVoices.forEach(({ voice_id, name }) => {
        if (!uniqueVoices.has(voice_id)) {
          uniqueVoices.set(voice_id, name);
        }
      });
      
      props.voice = {
        type: "string",
        label: "Voice",
        description: "The voice to use when generating the audio.",
        options: Array.from(uniqueVoices.entries())
          .map(([value, name]) => ({
            label: name,
            value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      };
    }
    return props;
  },
  async run({ $ }) {
    // Parse the model JSON to get the actual model id for the API call
    const modelData = JSON.parse(this.model);
    const { id: modelId } = modelData;
    
    const response = await this.apipieAi.createSpeech({
      $,
      data: {
        model: modelId,
        input: this.input,
        voice: this.voice,
        response_format: this.responseFormat,
        speed: this.speed,
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
