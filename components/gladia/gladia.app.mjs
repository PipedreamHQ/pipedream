import { axios } from "@pipedream/platform";
import { SUPPORTED_LANGUAGES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "gladia",
  propDefinitions: {
    audio: {
      type: "string",
      label: "Audio",
      description: "The path of the audio file in /tmp folder to be transcribed. The audio file should be in WAV format. To upload a file to /tmp folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    audioUrl: {
      type: "string",
      label: "Audio URL",
      description: "The URL of the audio file to be transcribed. The audio file should be in WAV format.",
    },
    languageBehaviour: {
      type: "string",
      label: "Language Behaviour",
      description: "Defines how the transcription model detects the audio language",
      options: [
        "manual",
        "automatic single language",
        "automatic multiple languages",
      ],
    },
    toggleNoiseReduction: {
      type: "boolean",
      label: "Toggle Noise Reduction",
      description: "Activate the noise reduction to improve transcription quality",
    },
    transcriptionHint: {
      type: "string",
      label: "Transcription Hint",
      description: "Provide a custom vocabulary to the model to improve accuracy of transcribing context specific words, technical terms, names, etc.",
    },
    toggleDiarization: {
      type: "boolean",
      label: "Toggle Diarization",
      description: "Activate the diarization of the audio",
    },
    targetTranslationLanguage: {
      type: "string",
      label: "Target Translation Language",
      description: "The target language for the direct translation. This parameter is only used when toggle_direct_translate is set to true.",
      options: SUPPORTED_LANGUAGES,
    },
    toggleDirectTranslate: {
      type: "boolean",
      label: "Toggle Direct Translation",
      description: "A boolean value indicating whether to perform direct translation. Set to true to use direct translation and false to disable direct translation.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gladia.io";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getHeaders(headers = {}) {
      return {
        "x-gladia-key": this._apiKey(),
        ...headers,
      };
    },
    _makeRequest({
      $ = this, headers, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, config);
    },
    sendAudioForTranscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/audio/text/audio-transcription",
        ...opts,
      });
    },
  },
};
