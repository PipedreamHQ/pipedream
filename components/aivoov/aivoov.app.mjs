import axios from "axios";

export default {
  type: "app",
  app: "aivoov",
  propDefinitions: {
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "The ID of the voice used to synthesize the text",
      async options({ provider }) {
        const voices = await this.getVoices({
          provider,
        });
        return voices.map(({
          name, language_code, voice_id,
        }) => ({
          label: `${name} (${language_code})`,
          value: voice_id?.replace?.("{{engine}}", "{engine}") ?? voice_id,
        }));
      },
    },
    transcribeText: {
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
    transcribeSsmlStyle: {
      type: "string",
      label: "Transcribe SSML Style",
      description: "A string representing the tone and accent of the voice to read the text",
      optional: true,
    },
    transcribeSsmlSpkRate: {
      type: "integer",
      label: "Transcribe SSML Speak Rate",
      description: "Must be in the closed interval of `[20, 200] %`. Use this to speed-up, or slow-down the speaking rate of the speech",
      optional: true,
      min: 20,
      max: 200,
    },
    transcribeSsmlVolume: {
      type: "integer",
      label: "Transcribe SSML Volume",
      description: "Must be in the closed interval of `[-40, 40] dB`. Use this to high or low the speaking volume of the speech",
      optional: true,
      min: -40,
      max: 40,
    },
    transcribeSsmlPitchRate: {
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
      // eslint-disable-next-line no-unused-vars
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      const response = await axios({
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
      return response.data;
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
