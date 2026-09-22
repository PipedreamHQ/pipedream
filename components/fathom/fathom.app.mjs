import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fathom",
  propDefinitions: {
    recordingId: {
      type: "string",
      label: "Recording ID",
      description: "The ID of a recording",
      async options({ prevContext }) {
        const {
          items, next_cursor: next,
        } = await this.listMeetings({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        return {
          options: items.map(({
            recording_id: value, title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: next,
          },
        };
      },
    },
    includeActionItems: {
      type: "boolean",
      label: "Include Action Items",
      description: "Include the action items for each meeting",
      optional: true,
    },
    includeCrmMatches: {
      type: "boolean",
      label: "Include CRM Matches",
      description: "Include CRM matches for each meeting. Only returns data from your or your team's linked CRM.",
      optional: true,
    },
    teamName: {
      type: "string",
      label: "Team",
      description: "Filter by team name, e.g. `Sales`. Use **List Teams** to find valid team names.",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque pagination cursor for fetching the next page of results. Use the `next_cursor` value returned in the previous response, e.g. `eyJwYWdlX251bSI6Mn0=`. Omit to fetch the first page.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fathom.ai/external/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    listMeetings(opts = {}) {
      return this._makeRequest({
        path: "/meetings",
        ...opts,
      });
    },
    getRecordingSummary({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/summary`,
        ...opts,
      });
    },
    getRecordingTranscript({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/transcript`,
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    listTeamMembers(opts = {}) {
      return this._makeRequest({
        path: "/team_members",
        ...opts,
      });
    },
    listMeetingTypes(opts = {}) {
      return this._makeRequest({
        path: "/meeting_types",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    requestRecordingDownload({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/download`,
        method: "POST",
        ...opts,
      });
    },
    getRecordingDownloadStatus({
      recordingId, downloadId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/downloads/${downloadId}`,
        ...opts,
      });
    },
  },
};
