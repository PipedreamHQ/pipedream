import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "meetstream_ai",
  propDefinitions: {
    meetingLink: {
      type: "string",
      label: "Meeting Link",
      description: "The link to the meeting where the bot should join",
    },
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot",
    },
    botName: {
      type: "string",
      label: "Bot Name",
      description: "The name of the bot",
      optional: true,
    },
    audioRequired: {
      type: "boolean",
      label: "Audio Required",
      description: "Whether audio is required",
      optional: true,
    },
    videoRequired: {
      type: "boolean",
      label: "Video Required",
      description: "Whether video is required",
      optional: true,
    },
    liveAudioRequired: {
      type: "boolean",
      label: "Live Audio Required",
      description: "Whether live audio is required",
      optional: true,
    },
    liveTranscriptionRequired: {
      type: "boolean",
      label: "Live Transcription Required",
      description: "Whether live transcription is required",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.meetstream.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createBotInstance(opts = {}) {
      const {
        meetingLink,
        botName,
        audioRequired,
        videoRequired,
        liveAudioRequired,
        liveTranscriptionRequired,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/bots",
        data: {
          meeting_link: meetingLink,
          bot_name: botName,
          audio_required: audioRequired,
          video_required: videoRequired,
          live_audio_required: liveAudioRequired,
          live_transcription_required: liveTranscriptionRequired,
        },
      });
    },
    async getBotStatus(opts = {}) {
      const { botId } = opts;
      return this._makeRequest({
        path: `/bots/${botId}/status`,
      });
    },
    async getRecordedAudio(opts = {}) {
      const { botId } = opts;
      return this._makeRequest({
        path: `/bots/${botId}/audio`,
      });
    },
    async getTranscript(opts = {}) {
      const { botId } = opts;
      return this._makeRequest({
        path: `/bots/${botId}/transcript`,
      });
    },
    async removeBotInstance(opts = {}) {
      const { botId } = opts;
      return this._makeRequest({
        method: "DELETE",
        path: `/bots/${botId}`,
      });
    },
  },
};
