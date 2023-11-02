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
        return meetings.map(({
          id, caption,
        }) => ({
          value: id,
          label: caption ?? id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.meet.ps/api";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getOwnedMeetings() {
      const { result } = await this._makeRequest({
        path: "/v2/meetings",
      });
      return result;
    },
    async getPollResults({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls/`,
        ...args,
      });
    },
    async getTopics({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/ideas/sessions`,
        ...args,
      });
    },
    async getEmailLeads({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/leads`,
        ...args,
      });
    },
  },
};
