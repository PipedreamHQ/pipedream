import { axios } from "@pipedream/platform";

import { cleanObject } from "./common/utils.mjs";

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
