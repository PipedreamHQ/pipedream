import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aivoov",
  propDefinitions: {
    voice_id: {
      type: "string",
      label: "Voice ID",
      description: "The ID of the voice used to synthesize the text",
      async options({ provider }) {
        const voices = await this.getVoices({
          provider,
        });
        return voices.map((voice) => ({
          label: `${voice.name} (${voice.language_code})`,
          value: voice.voice_id,
        }));
      },
    },
    transcribe_text: {
      type: "string[]",
      label: "Transcribe Text",
      description: "An array of strings, where each string represents a paragraph in plain text format OR valid SSML format",
    },
    engine: {
      type: "string",
      label: "Engine",
      description: "Select the preferences of the engine from the Voice Response.",
      options: [
        "standard",
        "neural",
        "neural2",
      ],
    },
    transcribe_ssml_style: {
      type: "string",
      label: "Transcribe SSML Style",
      description: "A string representing the tone and accent of the voice to read the text",
      optional: true,
    },
    transcribe_ssml_spk_rate: {
      type: "integer",
      label: "Transcribe SSML Speak Rate",
      description: "Must be in the closed interval of `[20, 200] %`. Use this to speed-up, or slow-down the speaking rate of the speech",
      optional: true,
      min: 20,
      max: 200,
    },
    transcribe_ssml_volume: {
      type: "integer",
      label: "Transcribe SSML Volume",
      description: "Must be in the closed interval of `[-40, 40] dB`. Use this to high or low the speaking volume of the speech",
      optional: true,
      min: -40,
      max: 40,
    },
    transcribe_ssml_pitch_rate: {
      type: "integer",
      label: "Transcribe SSML Pitch Rate",
      description: "Must be in the closed interval of `[-50, 50] %`. Use this to pitch-low, or pitch-low the speaking pitch of the speech",
      optional: true,
      min: -50,
      max: 50,
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "The provider of the voice.",
      options: [
        "google",
        "azure",
        "ibm",
        "aws",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://aivoov.com/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    async getVoices({ provider }) {
      const response = await this._makeRequest({
        path: `/voices?provider=${provider}`,
      });
      return response.data;
    },
    async transcribe(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transcribe",
        ...opts,
      });
    },
  },
};
