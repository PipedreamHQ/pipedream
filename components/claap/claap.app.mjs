import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "claap",
  propDefinitions: {
    recordingId: {
      type: "string",
      label: "Recording ID",
      description: "The identifier of the recording",
      async options({ prevContext }) {
        const { result } = await this.listRecordings({
          params: {
            cursor: prevContext?.nextCursor,
          },
        });
        return {
          options: result?.recordings?.map(({
            id, title,
          }) => ({
            value: id,
            label: title || id,
          })) || [],
          context: {
            nextCursor: result?.pagination?.nextCursor,
          },
        };
      },
    },
    channelId: {
      type: "string",
      label: "Channel / Folder ID",
      description: "Filter by folder/channel ID",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.claap.io/v1";
    },
    _headers() {
      return {
        "X-Claap-Key": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async listRecordings(opts = {}) {
      return this._makeRequest({
        path: "/recordings",
        ...opts,
      });
    },
    async getRecording({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}`,
        ...opts,
      });
    },
    async getRecordingTranscript({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/transcript`,
        ...opts,
      });
    },
    async createRecording(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recordings",
        ...opts,
      });
    },
    async deleteRecording({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/recordings/${recordingId}`,
        ...opts,
      });
    },
  },
};
