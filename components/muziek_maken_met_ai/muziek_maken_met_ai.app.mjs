import { randomUUID } from "node:crypto";
import { axios } from "@pipedream/platform";

const API_BASE_URL = "https://muziekmakenmetai.nl/api/v1";

const TERMINAL_STATUSES = [
  "succeeded",
  "failed",
];

export default {
  type: "app",
  app: "muziek_maken_met_ai",
  propDefinitions: {
    songId: {
      type: "string",
      label: "Generation ID",
      description: "ID of the song generation, as returned by **Generate Song**. Example: `a1b2c3d4-...`.",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Whether to poll the generation every 10 seconds until it succeeds or fails (up to 6 minutes) and return the final result with the audio URLs. When off, the action returns immediately with status `queued`. If the song is still processing after 6 minutes, the latest known status is returned and you can fetch it again with **Get Song**.",
      default: true,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Music description in standard mode (max 500 characters) or the full song lyrics in custom mode (max 5,000 characters).",
    },
    customMode: {
      type: "boolean",
      label: "Custom Mode",
      description: "Whether the prompt is the full song lyrics (**Style** becomes required) or a music description.",
      optional: true,
      default: false,
    },
    style: {
      type: "string",
      label: "Style",
      description: "Genre, instruments, tempo and mood. Required in custom mode. Max 1,000 characters.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Track title. Max 80 characters. Defaults to a generated title.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Full language name of the vocals, e.g. `Nederlands`, `Engels` or `Duits`. Other languages are allowed. Defaults to `Nederlands`. Max 40 characters.",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "Every model costs 1 credit per generation.",
      options: [
        {
          label: "Music V1",
          value: "music-v1",
          description: "V5 generation, previous model",
        },
        {
          label: "Music V1 Pro",
          value: "music-v1-pro",
          description: "V5.5 generation, previous model with duration control",
        },
        {
          label: "Music V2",
          value: "music-v2",
          description: "Latest model and recommended: more natural vocals, richer detail",
        },
        {
          label: "Music V2 Mini",
          value: "music-v2-mini",
          description: "Faster version of Music V2",
        },
        {
          label: "Music V2 Wild",
          value: "music-v2-wild",
          description: "More adventurous version of Music V2",
        },
      ],
      default: "music-v1",
    },
    instrumental: {
      type: "boolean",
      label: "Instrumental",
      description: "Whether to generate a track without vocals.",
      optional: true,
      default: false,
    },
    vocalGender: {
      type: "string",
      label: "Vocal Gender",
      description: "Gender of the vocals. Only used in custom mode.",
      options: [
        {
          label: "Female",
          value: "female",
        },
        {
          label: "Male",
          value: "male",
        },
      ],
      optional: true,
      default: "female",
    },
    styleWeight: {
      type: "integer",
      label: "Style Weight",
      description: "How strictly the generation follows the style, from 0 to 100 (mapped to 0-1). Only used in custom mode.",
      min: 0,
      max: 100,
      optional: true,
    },
    creativity: {
      type: "integer",
      label: "Creativity",
      description: "How much variation to allow, from 0 to 100 (mapped to 0-1). Only used in custom mode.",
      min: 0,
      max: 100,
      optional: true,
    },
    audioWeight: {
      type: "integer",
      label: "Audio Weight",
      description: "Weight of linked persona audio, from 0 to 100 (mapped to 0-1). Only used in custom mode with a persona.",
      min: 0,
      max: 100,
      optional: true,
    },
    durationSeconds: {
      type: "integer",
      label: "Duration (Seconds)",
      description: "Track length in seconds, from 10 to 360. Only with Music V1 Pro or a Music V2 model in custom mode.",
      min: 10,
      max: 360,
      optional: true,
    },
    variety: {
      type: "integer",
      label: "Variety",
      description: "How much the generation may deviate from the input. Only used in custom mode with Music V2 models.",
      options: [
        {
          label: "Strict",
          value: 0,
          description: "Follow the prompt and style strictly",
        },
        {
          label: "Balanced (Default)",
          value: 1,
          description: "Standard balance",
        },
        {
          label: "More Variation",
          value: 2,
          description: "A bit more variation",
        },
        {
          label: "Looser",
          value: 3,
          description: "Clearly looser with the input",
        },
        {
          label: "Maximum Surprise",
          value: 4,
          description: "As surprising as possible",
        },
      ],
      optional: true,
      default: 1,
    },
    negativeTags: {
      type: "string",
      label: "Negative Tags",
      description: "Comma-separated tags to avoid, e.g. `heavy metal, distortion`. Only used in custom mode. Combined max 300 characters.",
      optional: true,
    },
    personaId: {
      type: "string",
      label: "Persona ID",
      description: "ID of one of your own personas. Only used in custom mode.",
      optional: true,
    },
    personaType: {
      type: "string",
      label: "Persona Type",
      description: "How the **Persona ID** is applied. Only used in custom mode.",
      options: [
        {
          label: "Style",
          value: "style",
          description: "Use the persona as a style reference",
        },
        {
          label: "Voice",
          value: "voice",
          description: "Use the persona voice. Only with Music V2 models.",
        },
      ],
      optional: true,
      default: "style",
    },
  },
  methods: {
    /**
     * Make an authenticated request to the MuziekMakenMetAI API.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {object} opts - the request options
     * @param {string} [opts.method=GET] - the HTTP method
     * @param {string} opts.path - the API path, e.g. `/account/`
     * @param {object} [opts.data] - the JSON request body
     * @param {object} [opts.extraHeaders] - additional request headers
     * @returns {object} the parsed JSON response
     */
    async _request($, {
      method = "GET", path, data, extraHeaders,
    }) {
      return axios($, {
        method,
        url: `${API_BASE_URL}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...extraHeaders,
        },
        data,
      });
    },
    /**
     * Start a song generation (costs 1 credit). The request includes an
     * `Idempotency-Key` header so a retry cannot start a second generation.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {object} song - the generation request body
     * @returns {object} the created generation, including `id` and `status`
     */
    async createSong($, song) {
      return this._request($, {
        method: "POST",
        path: "/music/generations/",
        data: song,
        extraHeaders: {
          "Idempotency-Key": randomUUID(),
        },
      });
    },
    /**
     * Get one song generation, including its status and audio files.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} songId - the generation ID
     * @returns {object} the generation
     */
    async getSong($, songId) {
      return this._request($, {
        path: `/music/generations/${encodeURIComponent(songId)}/`,
      });
    },
    /**
     * Get the credit balance and rate limits of the connected account.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @returns {object} the account
     */
    async getAccount($) {
      return this._request($, {
        path: "/account/",
      });
    },
    /**
     * Register or unregister the webhook URL of the API key. The API supports
     * a single webhook per key; passing an empty string unregisters it. The
     * response of a registration contains a `signing_secret` used to verify
     * incoming events.
     *
     * @param {string} url - the webhook URL to register, or an empty string
     * to unregister
     * @returns {object} the API response, containing `signing_secret` on
     * registration
     */
    async setWebhookUrl(url) {
      return this._request(null, {
        method: "PUT",
        path: "/webhook/",
        data: {
          url,
        },
      });
    },
    /**
     * Poll a generation until it reaches a terminal status or times out.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} songId - the generation ID
     * @param {object} [opts] - polling options
     * @param {number} [opts.intervalMs=10000] - milliseconds between polls
     * @param {number} [opts.timeoutMs=360000] - milliseconds before giving up
     * @returns {object} the latest known generation
     */
    async pollSong($, songId, {
      intervalMs = 10000, timeoutMs = 360000,
    } = {}) {
      const deadline = Date.now() + timeoutMs;
      let generation = await this.getSong($, songId);
      while (!TERMINAL_STATUSES.includes(generation.status) && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        generation = await this.getSong($, songId);
      }
      return generation;
    },
    isTerminalStatus(status) {
      return TERMINAL_STATUSES.includes(status);
    },
  },
};
