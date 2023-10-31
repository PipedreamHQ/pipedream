import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "meetingpulse",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The ID of the meeting",
      async options() {
        const meetings = await this.getOwnedMeetings();
        return meetings.map((meeting) => ({
          value: meeting.id,
          label: meeting.title,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.meet.ps/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getOwnedMeetings() {
      return this._makeRequest({
        path: "/v2/meetings",
      });
    },
    async getPollResults({ meetingId }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls/`,
      });
    },
    async getTopics({ meetingId }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/ideas/sessions`,
      });
    },
    async getEmailLeads({ meetingId }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/leads`,
      });
    },
  },
};
