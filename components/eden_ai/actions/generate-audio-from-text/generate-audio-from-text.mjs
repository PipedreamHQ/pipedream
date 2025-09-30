import app from "../../eden_ai.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "eden_ai-generate-audio-from-text",
  name: "Generate Audio From Text",
  description: "Generates an audio from the provided text. [See the documentation](https://docs.edenai.co/reference/audio_text_to_speech_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The input text to be converted to speech",
    },
    provider: {
      type: "string",
      label: "Providers",
      description: "The audio generation service provider",
      options: constants.AVAILABLE_PROVIDERS,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the input text",
      options: constants.LANGUAGE_CODES,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice option",
      options: constants.VOICE_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.app.generateAudioFromText({
      $,
      data: {
        "providers": this.provider,
        "text": this.text,
        "language": this.language,
        "option": this.voice,
      },
    });

    if (response) {
      $.export("$summary", "Successfully generated audio from text");
    }

    return response;
  },
};
