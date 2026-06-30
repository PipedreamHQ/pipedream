import { axios } from "@pipedream/platform";

import { cleanObject } from "./common/utils.mjs";

const COMMUNICATION_CHANNEL_OPTIONS = [
  "supercarl_direct_message",
  "supercarl_invite",
  "supercarl_referral_request",
  "gmail_send",
  "linkedin_send_message",
  "x_send_message",
  "instagram_send_message",
];

export default {
  type: "app",
  app: "super_carl",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "Natural-language search query, for example `Head of Growth candidates in NYC warm through my network`.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Optional Super Carl AdvancedFilters JSON object for structured constraints. Example: `{ \"job_titles\": { \"include\": [\"Head of Growth\"], \"current_only\": true }, \"locations\": { \"include\": [\"New York\"] }, \"connection_degrees\": [\"1st\"] }`.",
      optional: true,
    },
    delegateUserId: {
      type: "string",
      label: "Delegate User ID",
      description: "Optional Super Carl team-seat user ID to search as. Use the user record ID for a teammate the API key owner can delegate to, for example `usr_abc123`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 10,
      min: 1,
      max: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip.",
      optional: true,
      default: 0,
      min: 0,
    },
    previewLimit: {
      type: "integer",
      label: "Preview Limit",
      description: "Maximum number of preview rows to return.",
      optional: true,
      default: 10,
      min: 1,
      max: 25,
    },
    evidenceFormat: {
      type: "string",
      label: "Evidence Format",
      description: "`none` returns compact rows, `reasons` adds match reasons, `text` adds profile prose, `json` adds structured evidence, and `both` returns text plus JSON. Applies only when Preview is disabled.",
      optional: true,
      default: "reasons",
      options: [
        "none",
        "reasons",
        "text",
        "json",
        "both",
      ],
    },
    relationshipDetail: {
      type: "string",
      label: "Relationship Detail",
      description: "`none` omits relationship data, `summary` includes social proximity and mutual counts, and `intro_paths` includes warm-intro path details when available.",
      optional: true,
      default: "none",
      options: [
        "none",
        "summary",
        "intro_paths",
      ],
    },
    communicationChannel: {
      type: "string",
      label: "Channel",
      description: "Outbound channel. Use `gmail_send` for email, `linkedin_send_message` for LinkedIn, `x_send_message` for X, `instagram_send_message` for Instagram, or a `supercarl_*` channel for in-product Super Carl messaging.",
      options: COMMUNICATION_CHANNEL_OPTIONS,
    },
    communicationChannels: {
      type: "string[]",
      label: "Channels",
      description: "Optional channels to check. Example: `[\"gmail_send\", \"linkedin_send_message\"]`. Leave blank to check every supported channel.",
      options: COMMUNICATION_CHANNEL_OPTIONS,
      optional: true,
    },
    communicationId: {
      type: "string",
      label: "Communication ID",
      description: "ID returned by Create Communication Draft or Send Communication, for example `communication_123`.",
    },
    targetUserId: {
      type: "string",
      label: "Target User ID",
      description: "Optional Super Carl person/user ID for the communication target, for example `usr_abc123`.",
      optional: true,
    },
    linkedinProfileUrl: {
      type: "string",
      label: "LinkedIn Profile URL",
      description: "Optional LinkedIn profile URL for the communication target, for example `https://www.linkedin.com/in/target-person/`.",
      optional: true,
    },
    linkedinUsername: {
      type: "string",
      label: "LinkedIn Username",
      description: "Optional LinkedIn public identifier when a full profile URL is not available.",
      optional: true,
    },
    xProfileUrl: {
      type: "string",
      label: "X Profile URL",
      description: "Optional X profile URL for the communication target, for example `https://x.com/username`.",
      optional: true,
    },
    xUsername: {
      type: "string",
      label: "X Username",
      description: "Optional X username without the `@` symbol.",
      optional: true,
    },
    instagramProfileUrl: {
      type: "string",
      label: "Instagram Profile URL",
      description: "Optional Instagram profile URL for the communication target.",
      optional: true,
    },
    instagramUsername: {
      type: "string",
      label: "Instagram Username",
      description: "Optional Instagram username without the `@` symbol.",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Recipient email address for Gmail sends, or a returned email option from Check Communication Capabilities.",
      optional: true,
    },
    connectorUserId: {
      type: "string",
      label: "Connector User ID",
      description: "Required only for `supercarl_referral_request`. Use an ID from `supercarl.candidate_connectors` returned by Check Communication Capabilities.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message body to save or send. For draft flows, `[JoinLink]` macros may be expanded by Super Carl.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject. Required when Channel is `gmail_send`.",
      optional: true,
    },
    context: {
      type: "object",
      label: "Context",
      description: "Optional structured context JSON for communication generation or audit metadata.",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Optional key to prevent duplicate sends when retrying a workflow step.",
      optional: true,
    },
    waitMs: {
      type: "integer",
      label: "Wait Milliseconds",
      description: "Optional wait time for communication progress, capped by Super Carl at 30000 ms.",
      optional: true,
      default: 0,
      min: 0,
      max: 30000,
    },
    waitUntil: {
      type: "string",
      label: "Wait Until",
      description: "Wait condition when Wait Milliseconds is set. Use `terminal` for completed/failed/cancelled status, or `first_progress` for the first new event.",
      optional: true,
      default: "terminal",
      options: [
        "terminal",
        "first_progress",
      ],
    },
  },
  methods: {
    /**
     * Return the Super Carl API base URL.
     *
     * @returns {string} Super Carl API base URL.
     */
    _baseUrl() {
      return "https://api.supercarl.ai";
    },
    /**
     * Build authenticated request headers.
     *
     * @param {Object} [headers={}] Additional request headers.
     * @returns {Object} Request headers with the Super Carl API key.
     */
    _headers(headers = {}) {
      return {
        ...headers,
        "X-API-Key": this.$auth.api_key,
      };
    },
    /**
     * Make an authenticated request to the Super Carl API.
     *
     * @param {Object} opts Request options.
     * @param {Object} [opts.$=this] Pipedream step context.
     * @param {string} opts.path API path beginning with `/`.
     * @param {Object} [opts.headers] Additional request headers.
     * @returns {Promise<Object>} API response.
     */
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        url: path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    /**
     * Get network sync and graph-readiness metadata.
     *
     * @param {Object} [opts={}] Request options.
     * @returns {Promise<Object>} Network summary response.
     */
    getNetworkSummary(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/network/summary",
        ...opts,
      });
    },
    /**
     * Search Super Carl people profiles.
     *
     * @param {Object} [opts={}] Request options.
     * @param {boolean} [opts.preview=true] Whether to use the preview endpoint.
     * @returns {Promise<Object>} People search response.
     */
    searchPeople({
      preview = true, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: preview
          ? "/api/v1/search/people/preview"
          : "/api/v1/search/people",
        ...opts,
      });
    },
    /**
     * Search companies in Super Carl.
     *
     * @param {Object} [opts={}] Request options.
     * @returns {Promise<Object>} Company search response.
     */
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/companies/search/preview",
        ...opts,
      });
    },
    /**
     * Search jobs in Super Carl.
     *
     * @param {Object} [opts={}] Request options.
     * @param {boolean} [opts.withPeople=false] Whether to include people at each hiring company.
     * @returns {Promise<Object>} Job search response.
     */
    searchJobs({
      withPeople = false, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: withPeople
          ? "/api/v1/search/jobs/with-people"
          : "/api/v1/search/jobs/preview",
        ...opts,
      });
    },
    /**
     * Search posts and activity signals in Super Carl.
     *
     * @param {Object} [opts={}] Request options.
     * @param {boolean} [opts.withPeople=false] Whether to include deduped people
     * from matching activity.
     * @returns {Promise<Object>} Post search response.
     */
    searchPosts({
      withPeople = false, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: withPeople
          ? "/api/v1/search/posts/with-people"
          : "/api/v1/search/posts/preview",
        ...opts,
      });
    },
    /**
     * Check target-specific communication channel readiness.
     *
     * @param {Object} [opts={}] Request options.
     * @returns {Promise<Object>} Communication capabilities response.
     */
    getCommunicationCapabilities(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/communications/capabilities",
        ...opts,
      });
    },
    /**
     * Create, draft, dry-run, or send a communication.
     *
     * @param {Object} [opts={}] Request options.
     * @returns {Promise<Object>} Communication response.
     */
    createCommunication(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/communications",
        ...opts,
      });
    },
    /**
     * Fetch communication status and recent events.
     *
     * @param {Object} [opts={}] Request options.
     * @param {string} opts.communicationId Communication ID.
     * @returns {Promise<Object>} Communication detail response.
     */
    getCommunication({
      communicationId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/v1/communications/${communicationId}`,
        ...opts,
      });
    },
    /**
     * Cancel a queued or in-progress communication.
     *
     * @param {Object} [opts={}] Request options.
     * @param {string} opts.communicationId Communication ID.
     * @returns {Promise<Object>} Cancelled communication response.
     */
    cancelCommunication({
      communicationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v1/communications/${communicationId}/cancel`,
        ...opts,
      });
    },
    /**
     * Fetch communication history for a target.
     *
     * @param {Object} [opts={}] Request options.
     * @returns {Promise<Object>} Communication history response.
     */
    getCommunicationHistory(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/communications/history",
        ...opts,
      });
    },
    /**
     * Remove empty values from a request payload.
     *
     * @param {Object} [payload={}] Request payload.
     * @returns {Object} Payload without empty values.
     */
    cleanPayload(payload = {}) {
      return cleanObject(payload);
    },
  },
};
