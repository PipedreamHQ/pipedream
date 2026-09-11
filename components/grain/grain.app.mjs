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
    transcript: {
      type: "boolean",
      label: "Include Transcript",
      description: "Whether to include the highlight's transcript",
      optional: true,
    },
    speakers: {
      type: "boolean",
      label: "Include Speakers",
      description: "Whether to include the highlight's speakers",
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
    /**
     * Fetch a page of recordings matching the supplied filters.
     * @param {object} [opts={}] Request context and data containing filter, include, and cursor.
     * @returns {Promise<object>} Recordings and the cursor for the next page.
     */
    listRecordings(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recordings",
        ...opts,
      });
    },
    /**
     * Fetch recording metadata and optional related data.
     * @param {object} opts Request context, recordingId, and data containing include options.
     * @returns {Promise<object>} The recording.
     */
    fetchRecording({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/recordings/${recordingId}`,
        ...opts,
      });
    },
    /**
     * Fetch a recording's transcript in the requested format.
     * @param {object} opts Request context, recordingId, and format (json, txt, vtt, or srt).
     * @returns {Promise<object[]|string>} Transcript segments for JSON, or transcript text.
     */
    fetchTranscript({
      recordingId, format, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordingId}/transcript${format === "json"
          ? ""
          : `.${format}`}`,
        ...opts,
      });
    },
    /**
     * Register a webhook for a Grain event type.
     * @param {object} [opts={}] Request options with hook_url, hook_type, and include in data.
     * @returns {Promise<object>} The registered hook, including its ID.
     */
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks/create",
        ...opts,
      });
    },
    /**
     * Remove a webhook registration.
     * @param {string} hookId The ID returned when the hook was created.
     * @returns {Promise<object>} The API's success response.
     */
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
  },
};
