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
    async getPoll({
      meetingId, pollId, ...args
    }) {
      const { result } = await this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls/${pollId}`,
        ...args,
      });
      return result;
    },
    async listPolls({
      meetingId, ...args
    }) {
      const { result } = await this._makeRequest({
        path: `/v1/meetings/${meetingId}/polls`,
        ...args,
      });
      return result;
    },
    async getTopics({
      meetingId, ...args
    }) {
      const { result } = await this._makeRequest({
        path: `/v1/meetings/${meetingId}/ideas/sessions`,
        ...args,
      });
      return result;
    },
    async getEmailLeads({
      meetingId, ...args
    }) {
      const { result } = await this._makeRequest({
        path: `/v1/meetings/${meetingId}/leads`,
        ...args,
      });
      return result;
    },
  },
};
