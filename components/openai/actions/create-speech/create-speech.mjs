import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-speech",
  name: "Create Speech",
  description: "Generates audio from the input text. [See the documentation](https://beta.openai.com/docs/guides/audio)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the text-to-speech conversion. One of the available tts models: `tts-1` or `tts-1-hd`",
      options: [
        "tts-1",
        "tts-1-hd",
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The text to generate audio for. The maximum length is 4096 characters.",
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer.",
      options: [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to audio in. Supported formats are mp3, opus, aac, and flac.",
      options: [
        "mp3",
        "opus",
        "aac",
        "flac",
      ],
      optional: true,
    },
    speed: {
      type: "number",
      label: "Speed",
      description: "The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.",
      min: 0.25,
      max: 4.0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.createSpeech({
      model: this.model,
      input: this.input,
      voice: this.voice,
      response_format: this.responseFormat,
      speed: this.speed,
    });

    $.export("$summary", "Generated speech successfully");
    return response;
  },
};
