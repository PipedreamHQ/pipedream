import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gladia",
  propDefinitions: {
    audio_url: {
      type: "string",
      label: "Audio URL",
      description: "The URL of the audio file to be transcribed. The audio file should be in WAV format.",
    },
    language_behaviour: {
      type: "string",
      label: "Language Behaviour",
      description: "Defines how the transcription model detects the audio language",
      options: [
        "manual",
        "automatic single language",
        "automatic multiple languages",
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "If language_behaviour is set to manual, define the language to use for the transcription",
    },
    toggle_noise_reduction: {
      type: "boolean",
      label: "Toggle Noise Reduction",
      description: "Activate the noise reduction to improve transcription quality",
      optional: true,
    },
    transcription_hint: {
      type: "string",
      label: "Transcription Hint",
      description: "Provide a custom vocabulary to the model to improve accuracy of transcribing context specific words, technical terms, names, etc.",
      optional: true,
    },
    toggle_diarization: {
      type: "boolean",
      label: "Toggle Diarization",
      description: "Activate the diarization of the audio",
      optional: true,
    },
    translate_audio: {
      type: "boolean",
      label: "Translate Audio?",
      optional: true,
    },
    target_translation_language: {
      type: "string",
      label: "Target Translation Language",
      description: "The target language for the direct translation. This parameter is only used when toggle_direct_translate is set to true.",
      optional: true,
      async options({ translate_audio }) {
        if (!translate_audio) {
          return [];
        }
        const response = await this.getSupportedLanguages();
        return response.map((language) => ({
          label: language,
          value: language,
        }));
      },
    },
    toggle_direct_translate: {
      type: "boolean",
      label: "Toggle Direct Translation",
      description: "A boolean value indicating whether to perform direct translation. Set to true to use direct translation and false to disable direct translation.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gladia.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-gladia-key": this.$auth.api_token,
        },
      });
    },
    async getSupportedLanguages() {
      const response = await this._makeRequest({
        path: "/reference/supported-languages",
      });
      return response.languages;
    },
    async sendAudioForTranscription(opts = {}) {
      return this._makeRequest({
        path: "/audio/text/audio-transcription",
        data: {
          audio_url: opts.audio_url,
          language_behaviour: opts.language_behaviour,
          language: opts.language,
          toggle_noise_reduction: opts.toggle_noise_reduction,
          transcription_hint: opts.transcription_hint,
          toggle_diarization: opts.toggle_diarization,
          toggle_direct_translate: opts.toggle_direct_translate,
          target_translation_language: opts.target_translation_language,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
