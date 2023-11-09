import openai from "../../openai.app.mjs";

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

    $.export("$summary", "Generated speech successfully");
    return response;
  },
};
