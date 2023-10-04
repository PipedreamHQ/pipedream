import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aivoov",
  propDefinitions: {
    provider: {
      type: "string",
      label: "Provider",
      description: "Select a provider",
      options: ["google", "azure", "ibm", "aws"],
    },
    voice_id: {
      type: "string",
      label: "Voice ID",
      description: "The ID of the voice used to synthesize the text",
      async options({ provider }) {
        const voices = await this.getVoices({ provider });
        return voices.map((voice) => ({
          label: `${voice.name} (${voice.language_name})`,
          value: voice.voice_id,
        }));
      },
    },
    transcribe_text: {
      type: "string",
      label: "Text to Transcribe",
      description: "The text to be converted to audio",
    },
    engine: {
      type: "string",
      label: "Engine",
      description: "The preferences of the engine",
    },
    transcribe_ssml_style: {
      type: "string",
      label: "SSML Style",
      description: "The tone and accent of the voice to read the text",
      optional: true,
    },
    transcribe_ssml_spk_rate: {
      type: "string",
      label: "SSML Speaking Rate",
      description: "The speaking rate of the speech",
      optional: true,
    },
    transcribe_ssml_volume: {
      type: "string",
      label: "SSML Volume",
      description: "The speaking volume of the speech",
      optional: true,
    },
    transcribe_ssml_pitch_rate: {
      type: "string",
      label: "SSML Pitch Rate",
      description: "The speaking pitch of the speech",
      optional: true,
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
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async getVoices({ provider }) {
      return this._makeRequest({
        path: `/voices?provider=${provider}`,
      });
    },
    async transcribe(opts) {
      return this._makeRequest({
        method: "POST",
        path: "/transcribe",
        data: opts,
      });
    },
  },
};