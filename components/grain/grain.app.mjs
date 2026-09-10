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
     * List workspace users.
     * @param {object} [opts={}] Request context.
     * @returns {Promise<object>} The workspace's users.
     */
    listUsers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    /**
     * List workspace teams.
     * @param {object} [opts={}] Request context.
     * @returns {Promise<object>} The workspace's teams.
     */
    listTeams(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/teams",
        ...opts,
      });
    },
    /**
     * List configured meeting types.
     * @param {object} [opts={}] Request context.
     * @returns {Promise<object>} The workspace's meeting types.
     */
    listMeetingTypes(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/meeting_types",
        ...opts,
      });
    },
    /**
     * Rename a recording.
     * @param {object} opts Request context, recordingId, and data containing the new title.
     * @returns {Promise<object>} The updated recording.
     */
    updateRecordingTitle({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/recordings/${recordingId}`,
        ...opts,
      });
    },
    /**
     * Add a tag to a recording.
     * @param {object} opts Request context, recordingId, and data containing the tag.
     * @returns {Promise<object>} The API's success response.
     */
    addRecordingTag({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/recordings/${recordingId}/tags`,
        ...opts,
      });
    },
    /**
     * Remove a tag from a recording.
     * @param {object} opts Request context, recordingId, and tag.
     * @returns {Promise<object>} The API's success response.
     */
    removeRecordingTag({
      recordingId, tag, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/recordings/${recordingId}/tags/${encodeURIComponent(tag)}`,
        ...opts,
      });
    },
    /**
     * Share a recording with a user or team.
     * @param {object} opts Request context, recordingId, targetType (user or team), and data
     * containing the target's ID under `user_id` or `team_id`.
     * @returns {Promise<object>} The API's success response.
     */
    shareRecording({
      recordingId, targetType, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/recordings/${recordingId}/${targetType}s`,
        ...opts,
      });
    },
    /**
     * Unshare a recording from a user or team.
     * @param {object} opts Request context, recordingId, targetType (user or team), and targetId.
     * @returns {Promise<object>} The API's success response.
     */
    unshareRecording({
      recordingId, targetType, targetId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/recordings/${recordingId}/${targetType}s/${targetId}`,
        ...opts,
      });
    },
    /**
     * Download a recording's media file.
     * @param {object} opts Request context and recordingId. Pass `responseType: "arraybuffer"`
     * and `returnFullResponse: true` to receive the raw binary and headers.
     * @returns {Promise<object>} The recording's media file.
     */
    downloadRecording({
      recordingId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/recordings/${recordingId}/download`,
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
