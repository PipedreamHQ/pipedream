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
    gender: {
      type: "string",
      label: "Gender",
      description: "A tag describing the gender of this voice, e.g. male, female, nonbinary.",
      options: [
        "male",
        "female",
        "nonbinary",
      ],
      optional: true,
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
    type: {
      type: "string",
      label: "Type",
      description: "The method by which this voice was created: instant or professional.",
      options: [
        "instant",
        "professional",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lmnt.com/v1/ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-Key": this.$auth.api_key,
        },
        data,
        params,
        ...otherOpts,
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
    // Added method from the requirements
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
