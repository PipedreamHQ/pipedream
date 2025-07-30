import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "rumi_ai",
  propDefinitions: {
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session",
    },
    sessionRecurrenceId: {
      type: "string",
      label: "Session Recurrence ID",
      description: "The recurrence ID of the session",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "Array of email addresses to grant access to",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "Array of domain names to grant access to",
      optional: true,
    },
    message: {
      type: "string",
      label: "Invitation Message",
      description: "Optional invitation message to include",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to add/remove access",
    },
    sessionTitle: {
      type: "string",
      label: "Session Title",
      description: "The title of the session",
    },
    about: {
      type: "string",
      label: "About",
      description: "Meeting description",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "Session start date and time in ISO format (e.g., `2025-06-15T14:30:00`)",
      default: "2025-06-15T09:00:00",
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "Session end date and time in ISO format (e.g., `2025-06-15T15:30:00`)",
      default: "2025-06-15T10:00:00",
    },
    enableRecording: {
      type: "boolean",
      label: "Enable Recording",
      description: "Enable call recording for this session",
    },
    summaAI: {
      type: "boolean",
      label: "Enable SummaAI",
      description: "Enable transcriptions and AI feed",
    },
    recurring: {
      type: "integer",
      label: "Recurring",
      description: "Recurring session setting (0 for non-recurring)",
      default: 0,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The AI query to stream",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Unique request identifier",
      optional: true,
    },
    tz: {
      type: "string",
      label: "Timezone",
      description: "Timezone for the query (e.g., Europe/Paris, America/New_York)",
      options: [
        "Europe/Paris",
        "America/New_York",
        "America/Los_Angeles",
        "Asia/Tokyo",
        "Asia/Kolkata",
        "Australia/Sydney",
        "UTC",
      ],
    },
    sessions: {
      type: "string[]",
      label: "Sessions",
      description: "Array of session objects in JSON format. Each entry should be a JSON string like: `{\"id\": \"session_id\", \"recurrenceIds\": [\"recurrence_id_1\", \"recurrence_id_2\"]}`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of resources to retrieve",
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.rumi.ai/v1.0${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
    put(args = {}) {
      return this._makeRequest({
        ...args,
        method: "PUT",
      });
    },
    getCurrentUser(args) {
      return this._makeRequest({
        path: "/users/me",
        ...args,
      });
    },
    getPastSessions(args) {
      return this._makeRequest({
        path: "/sessions/past",
        ...args,
      });
    },
    getFutureSessions(args) {
      return this._makeRequest({
        path: "/sessions/future",
        ...args,
      });
    },
    createSession(args = {}) {
      return this.post({
        path: "/sessions",
        ...args,
      });
    },
    addSessionAccess(args = {}) {
      return this.put({
        path: "/sessions/access/add",
        ...args,
      });
    },
    removeSessionAccess(args = {}) {
      return this.delete({
        path: "/sessions/access/remove",
        ...args,
      });
    },
    streamAiQuery(args = {}) {
      return this.post({
        path: "/memory/ai-stream",
        ...args,
      });
    },
    getMemoryThreads(args = {}) {
      return this._makeRequest({
        path: "/memory/threads",
        ...args,
      });
    },
    getMeetingTypes(args) {
      return this._makeRequest({
        path: "/meeting-types",
        ...args,
      });
    },
  },
};
