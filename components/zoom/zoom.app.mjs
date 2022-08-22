import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoom",
  propDefinitions: {
    meetingIds: {
      type: "integer[]",
      label: "Meeting Filter",
      description: "Optionally filter for events for one or more meetings",
      async options({ page }) {
        const { meetings } = await this.listMeetings({
          page_number: page + 1,
        });
        return meetings.map((meeting) => ({
          label: `${meeting.topic} (${meeting.id})`,
          value: meeting.id,
        }));
      },
      optional: true,
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
      optional: true,
      default: false,
    },
    includeChatTranscripts: {
      type: "boolean",
      label: "Include Chat Transcripts",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to `true` to include chat transcripts",
      optional: true,
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.zoom.us/v2/";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        headers,
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        headers: {
          ...headers,
          ...this._getHeaders(),
        },
        url: `${this._baseUrl()}${path}`,
        ...otherArgs,
      };
      return axios($, config);
    },
    async getPastMeetingDetails(meetingId, params) {
      return this._makeRequest({
        path: `past_meetings/${meetingId}`,
        params,
      });
    },
    async listMeetings(params) {
      return this._makeRequest({
        path: "users/me/meetings",
        params,
      });
    },
    async listWebinars(params) {
      return this._makeRequest({
        path: "users/me/webinars",
        params,
      });
    },
    async listWebinarMetrics(params) {
      return this._makeRequest({
        path: "metrics/webinars",
        params,
      });
    },
    async listRecordings(params) {
      return this._makeRequest({
        path: "users/me/recordings",
        params,
      });
    },
  },
};
