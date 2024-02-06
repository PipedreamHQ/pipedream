import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "uberduck",
  propDefinitions: {
    voicemodelUuid: {
      type: "string",
      label: "Voice Model UUID",
      description: "The UUID of the voice model",
      async options({ page }) {
        const response = await this.listVoices({
          page,
        });

        return response.map((voice) => ({
          label: voice.display_name,
          value: voice.voicemodel_uuid,
        }));
      },
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The type of voice to list",
      options: [
        "tts-basic",
        "tts-reference",
        "tts-all",
        "v2v",
        "all",
        "tts-rap",
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the voice",
      options: [
        "english",
        "dutch",
        "spanish",
        "portuguese",
        "polish",
      ],
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private",
      description: "Filter for private voices",
    },
    owner: {
      type: "boolean",
      label: "Owner",
      description: "Filter for voices owned by the user",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by the name of the voice",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.uberduck.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.api_key}`,
          password: `${this.$auth.secret_key}`,
        },
      });
    },
    async listVoices(opts = {}) {
      const {
        mode, language, isPrivate, owner, name, page, ...args
      } = opts;
      return this._makeRequest({
        path: "/voices",
        params: {
          mode,
          language,
          is_private: isPrivate,
          owner,
          name,
          page,
        },
        ...args,
      });
    },
    async listVoiceSamples({
      voicemodelUuid, ...args
    }) {
      return this._makeRequest({
        path: `/voices/${voicemodelUuid}/samples`,
        ...args,
      });
    },
    async generateLyrics(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tts/lyrics",
        ...args,
      });
    },
  },
};
