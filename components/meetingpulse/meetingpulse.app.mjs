import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "meetingpulse",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "Select a Meeting or provide a custom Meeting ID.",
      async options() {
        const meetings = await this.getOwnedMeetings();
        return meetings.map(({
          name, caption,
        }) => ({
          value: name,
          label: caption ?? name,
        }));
      },
    },
    pollId: {
      type: "string",
      label: "Poll ID",
      description: "Select a Poll or provide a custom Poll ID.",
      async options({ meetingId }) {
        const polls = await this.listPolls({
          meetingId,
        });
        return polls.map(({
          id, question,
        }) => ({
          value: id,
          label: question ?? id,
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
      const { result } = await axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.access_token}`,
          accept: "application/json",
        },
      });
      return result;
    },
    async getOwnedMeetings() {
      return this._makeRequest({
        path: "/v2/meetings/",
      });
    },
    async getPoll({
      meetingId, pollId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls/${pollId}`,
        ...args,
      });
    },
    async listPolls({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls`,
        ...args,
      });
    },
    async getTopics({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/meetings/${meetingId}/ideas`,
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
