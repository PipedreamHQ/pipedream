import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grain",
  propDefinitions: {
    recordingId: {
      type: "string",
      label: "Recording ID",
      description: "The ID of the recording to fetch. Use **List Recordings** to find recording IDs.",
      async options({ prevContext }) {
        const {
          recordings, cursor,
        } = await this.listRecordings({
          data: {
            cursor: prevContext?.nextPage,
          },
        });
        return {
          options: recordings.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })),
          context: {
            nextPage: cursor,
          },
        };
      },
    },
    highlights: {
      type: "boolean",
      label: "Include Highlights",
      description: "Whether to include the recording's highlights",
      optional: true,
    },
    participants: {
      type: "boolean",
      label: "Include Participants",
      description: "Whether to include the recording's participants",
      optional: true,
    },
    calendarEvent: {
      type: "boolean",
      label: "Include Calendar Event",
      description: "Whether to include the recording's calendar event data",
      optional: true,
    },
    hubspot: {
      type: "boolean",
      label: "Include HubSpot Data",
      description: "Whether to include associated HubSpot data",
      optional: true,
    },
    aiActionItems: {
      type: "boolean",
      label: "Include AI Action Items",
      description: "Whether to include the recording's AI action items",
      optional: true,
    },
    aiSummary: {
      type: "boolean",
      label: "Include AI Summary",
      description: "Whether to include the recording's AI summary",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.grain.com/_/public-api/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Public-Api-Version": "2025-10-31",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listRecordings(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recordings",
        ...opts,
      });
    },
    fetchRecording({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/recordings/${recordingId}`,
        ...opts,
      });
    },
    fetchTranscript({
      recordingId, format, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/transcript.${format}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks/create",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
  },
};
