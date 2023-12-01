import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lmnt",
  propDefinitions: {
    format: {
      type: "string",
      label: "Audio Format",
      description: "The format of the audio file. Either mp3 or wav; defaults to mp3.",
      options: [
        "mp3",
        "wav",
      ],
      default: "mp3",
      optional: true,
    },
    length: {
      type: "integer",
      label: "Length",
      description: "Produce speech of this length in seconds; maximum 300.0 (5 minutes).",
      optional: true,
      min: 1,
      max: 300,
    },
    returnDurations: {
      type: "boolean",
      label: "Return Durations",
      description: "If true, response will contain a durations field.",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Seed used to specify a different take; defaults to random.",
      optional: true,
    },
    speed: {
      type: "number",
      label: "Speed",
      description: "The talking speed of the generated speech. A floating point value between 0.25 (slow) and 2.0 (fast); defaults to 1.0.",
      optional: true,
      min: 0.25,
      max: 2.0,
      default: 1.0,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to synthesize.",
      required: true,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice ID of the voice to use for synthesis. Voice IDs can be retrieved by calls to List voices or Voice info.",
      required: true,
      async options() {
        const voices = await this.listVoices();
        return voices.map((voice) => ({
          label: voice.name,
          value: voice.id,
        }));
      },
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "The owner of this voice.",
      options: [
        "system",
        "me",
        "other",
      ],
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of this voice in the training pipeline (e.g., ready, training).",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The display name for this voice.",
    },
    enhance: {
      type: "boolean",
      label: "Enhance",
      description: "For unclean audio with background noise, applies processing to attempt to improve quality. Not on by default as it can also degrade quality in some circumstances.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of voice to create. Defaults to instant.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "A tag describing the gender of this voice. Has no effect on voice creation.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A text description of this voice.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lmnt.com/v1/ai";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        ...otherOpts,
        headers: {
          ...headers,
          "X-API-Key": this.$auth.api_key,
        },
      });
    },
    async listVoices(opts = {}) {
      return this._makeRequest({
        path: "/voice/list",
        ...opts,
      });
    },
    async synthesizeSpeech(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/speech",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...opts,
      });
    },
    async createVoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voice",
        ...opts,
      });
    },
  },
};
