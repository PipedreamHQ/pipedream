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
          label: voice.name,
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
      description: "Select the preferences of the engine from the Voice Response. There are three types of engine supported: neural2, neural, and standard",
    },
    transcribe_ssml_style: {
      type: "string[]",
      label: "Transcribe SSML Style",
      description: "A string representing the tone and accent of the voice to read the text",
      optional: true,
    },
    transcribe_ssml_spk_rate: {
      type: "string[]",
      label: "Transcribe SSML Speak Rate",
      description: "A string in the format <number>%, where <number> is in the closed interval of [20, 200]. Use this to speed-up, or slow-down the speaking rate of the speech",
      optional: true,
    },
    transcribe_ssml_volume: {
      type: "string[]",
      label: "Transcribe SSML Volume",
      description: "A string in the format <number>dB, where <number> is in the closed interval of [-40, 40]. Use this to high or low the speaking volume of the speech",
      optional: true,
    },
    transcribe_ssml_pitch_rate: {
      type: "string[]",
      label: "Transcribe SSML Pitch Rate",
      description: "A string in the format <number>%, where <number> is in the closed interval of [-50, 50]. Use this to pitch-low, or pitch-low the speaking pitch of the speech",
      optional: true,
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "The provider of the voice. Options are: google, azure, ibm, aws",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    async getVoices({ provider }) {
      return this._makeRequest({
        path: `/voices?provider=${provider}`,
      });
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
