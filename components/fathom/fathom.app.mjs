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
  },
};
