import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bloom_growth",
  propDefinitions: {
    meetingId: {
      type: "integer",
      label: "Meeting Id",
      description: "The Id of the meeting",
      async options() {
        const data = await this.listMeetings();

        return data.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ownerId: {
      type: "integer",
      label: "Owner Id",
      description: "The Id of the owner",
      async options() {
        const data = await this.listViewableUsers();

        return data.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the issue.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.bloomgrowth.com/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createIssue(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "issues/create",
        ...args,
      });
    },
    createTodo({
      meetingId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `l10/${meetingId}/todos`,
        ...args,
      });
    },
    listMeetings(args = {}) {
      return this._makeRequest({
        path: "l10/list",
        ...args,
      });
    },
    listMeetingIssues({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `l10/${meetingId}/issues`,
        ...args,
      });
    },
    listMeetingTodos({
      meetingId, ...args
    }) {
      return this._makeRequest({
        path: `l10/${meetingId}/todos`,
        ...args,
      });
    },
    listViewableUsers(args = {}) {
      return this._makeRequest({
        path: "users/mineviewable",
        ...args,
      });
    },
  },
};
