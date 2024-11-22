import fs from "fs";
import path from "path";
import app from "../../apipie_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "apipie_ai-text-to-speech",
  name: "Text To Speech",
  description: "Convert text to speech using the specified model and voice settings. [See the documentation](https://apipie.ai/docs/api/text-to-speech-conversion)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    provider: {
      description: "Name of the audio provider, default to `openai`.",
      propDefinition: [
        app,
        "provider",
      ],
    },
    model: {
      description: "The model to use for the conversion.",
      propDefinition: [
        app,
        "model",
        ({ provider }) => ({
          params: {
            provider,
            type: constants.MODEL_TYPE_OPTION.VOICE,
            enabled: 1,
          },
        }),
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input text to convert to speech.",
    },
    voice: {
      label: "Voice",
      description: "The voice setting for the speech synthesis.",
      propDefinition: [
        app,
        "model",
        ({ provider }) => ({
          params: {
            voices: "",
            enabled: 1,
            provider,
          },
          filter: (record) => record.provider === provider,
          mapper: ({
            voice_id: value,
            name: label,
          }) => ({
            value,
            label,
          }),
        }),
      ],
    },
    stability: {
      type: "string",
      label: "Stability",
      description: "Stability of the voice modulation, **0-1**. Possible values: <= `1`",
      optional: true,
    },
    similarityBoost: {
      type: "string",
      label: "Similarity Boost",
      description: "Boost the similarity of the voice modulation, **0-1**. Possible values: <= `1`",
      optional: true,
    },
    style: {
      type: "string",
      label: "Style",
      description: "Style of the voice modulation, **0-1**. Possible values: <= `1`",
      optional: true,
    },
    useSpeakerBoost: {
      type: "boolean",
      label: "Use Speaker Boost",
      description: "Whether to use speaker boost.",
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The audio format of the response (e.g., `mp3`, `opus`). Defaults to `mp3`.",
      optional: true,
    },
    speed: {
      type: "string",
      label: "Speed",
      description: "Speed of the speech playback. Possible values: >= `0.25` and <= `4`.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Whether to stream the response.",
      optional: true,
    },
  },
  methods: {
    textToSpeech(args = {}) {
      return this.app.post({
        path: "/audio/speech",
        headers: {
          "Accept": "audio/*",
        },
        ...args,
      });
    },
    writeAudio(data) {
      const fileName = `text-to-speech-${Date.now()}.${this.responseFormat || "mp3"}`;
      const filePath = path.join("/tmp", fileName);
      fs.writeFileSync(filePath, data);
      return filePath;
    },
  },
  async run({ $ }) {
    const {
      textToSpeech,
      writeAudio,
      provider,
      model,
      input,
      voice,
      stability,
      similarityBoost,
      style,
      useSpeakerBoost,
      responseFormat,
      speed,
      stream,
    } = this;

    const response = await textToSpeech({
      $,
      data: {
        provider,
        model,
        input,
        voice,
        responseFormat,
        speed,
        stream,
        ...(stability || similarityBoost || style || useSpeakerBoost && {
          voiceSettings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: useSpeakerBoost,
          },
        }),
      },
    });

    const filePath = writeAudio(response);

    $.export("$summary", "Successfully converted text to speech.");

    return {
      filePath,
    };
  },
};
