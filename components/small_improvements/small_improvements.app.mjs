import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "small_improvements",
  propDefinitions: {
    command: {
      type: "string",
      label: "Command",
      description: "The command to execute for the meeting notes.",
    },
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The ID of the meeting.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.small-improvements.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createMeetingNotes({
      meetingId, command,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/meetings/${meetingId}/notes`,
        data: {
          command,
        },
      });
    },
    async listAllUsers() {
      return this._makeRequest({
        method: "GET",
        path: "/users",
      });
    },
  },
  version: "0.0.1",
};
