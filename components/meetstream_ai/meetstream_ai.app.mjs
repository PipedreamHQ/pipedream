import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "meetstream_ai",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-meetstream-tst-hack.meetstream.ai/api/v1/bots";
    },
    _headers() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createBotInstance(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_bot",
        ...opts,
      });
    },
    getBotStatus({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/${botId}/status`,
        ...opts,
      });
    },
    getRecordedAudio({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/${botId}/get_audio`,
        ...opts,
      });
    },
    getTranscript({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/${botId}/get_transcript`,
        ...opts,
      });
    },
    removeBotInstance({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/${botId}/remove_bot`,
        ...opts,
      });
    },
  },
};
