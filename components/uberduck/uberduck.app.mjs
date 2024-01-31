import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "uberduck",
  propDefinitions: {
    voicemodelUuid: {
      type: "string",
      label: "Voice Model UUID",
      description: "The UUID of the voice model",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const response = await this.listVoices({
          page,
        });
        return {
          options: response.map((voice) => ({
            label: voice.display_name,
            value: voice.voicemodel_uuid,
          })),
          context: {
            page: page + 1,
          },
        };
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
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Basic ${Buffer.from(`${this.$auth.username}:${this.$auth.password}`).toString("base64")}`,
        },
      });
    },
    async listVoices(opts = {}) {
      const {
        mode, language, isPrivate, owner, name, page,
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
      });
    },
    async listVoiceSamples({ voicemodelUuid }) {
      return this._makeRequest({
        path: `/voices/${voicemodelUuid}/samples`,
      });
    },
    async generateLyrics({
      voicemodelUuid, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-lyrics",
        data: {
          voicemodel_uuid: voicemodelUuid,
          text,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
