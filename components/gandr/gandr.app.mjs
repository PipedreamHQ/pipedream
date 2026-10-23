import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gandr",
  propDefinitions: {
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice that will be used for the generated speech.",
      options: [
        "gandr-mia",
        "gandr-ava",
        "gandr-jenny",
        "gandr-dane",
        "gandr-leo",
        "gandr-lewis",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The audio format of the response. `pcm` is headerless signed 16-bit little-endian mono audio at 24000 Hz. Default: `mp3`",
      options: [
        "mp3",
        "wav",
        "pcm",
      ],
      default: "mp3",
    },
  },
  methods: {
    _apiUrl() {
      return "https://tts.gandr.ai/v1";
    },
    _getHeaders(args = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...args,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, config);
    },
    createSpeech(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "audio/speech",
        returnFullResponse: true,
        responseType: "stream",
        ...args,
      });
    },
  },
};
