import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lever",
  propDefinitions: {
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity. Use **Search Opportunities** to find opportunity IDs.",
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
      description: "User ID of the person performing this action — recorded in the audit trail. Use **List Users** to find user IDs.",
    },
    postingId: {
      type: "string",
      label: "Posting ID",
      description: "A job posting ID. Use **List Postings** to find posting IDs.",
      optional: true,
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "A pipeline stage ID. Use **List Stages** to find stage IDs.",
      optional: true,
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "How the candidate entered the pipeline.",
      optional: true,
      options: [
        "agency",
        "applied",
        "internal",
        "referred",
        "sourced",
        "university",
      ],
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Inline related objects in the response to avoid follow-up calls.",
      optional: true,
      options: [
        "applications",
        "stage",
        "owner",
        "followers",
        "sourcedBy",
        "contact",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return per page (1–100). Defaults to 100.",
      optional: true,
      default: 100,
    },
    offset: {
      type: "string",
      label: "Offset (cursor)",
      description: "Pagination cursor. Pass the `next` value from a previous response to fetch the next page.",
      optional: true,
    },
  },
  methods: {
    /**
     * Base URL for the Lever REST API.
     * @returns {string} The API base URL.
     */
    _baseUrl() {
      return "https://api.lever.co/v1";
    },
    /**
     * Serializes query params into a string, emitting array values as repeated
     * keys (`expand=stage&expand=owner`). Lever rejects axios' default
     * `expand[]=...`/comma-joined forms with "<values> is not expandable".
     * @param {Object} params - The query parameters to serialize.
     * @returns {string} The URL-encoded query string.
     */
    _paramsSerializer(params) {
      return Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null)
        .flatMap(([
          key,
          value,
        ]) => (Array.isArray(value)
          ? value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`))
        .join("&");
    },
    /**
     * Makes an authenticated request to the Lever API.
     * @param {Object} opts - Request options.
     * @param {Object} [opts.$] - The Pipedream step context (defaults to `this`).
     * @param {string} opts.path - API path appended to the base URL (e.g. `/users`).
     * @param {Object} [opts.headers] - Additional request headers.
     * @returns {Promise<Object>} The parsed Lever API response.
     */
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        paramsSerializer: this._paramsSerializer,
        ...opts,
      });
    },
    /**
     * Lists users in the Lever account.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of users (`{ data, hasNext, next }`).
     */
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    /**
     * Lists job postings.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of postings (`{ data, hasNext, next }`).
     */
    listPostings(opts = {}) {
      return this._makeRequest({
        path: "/postings",
        ...opts,
      });
    },
    /**
     * Retrieves a single job posting by ID.
     * @param {string} postingId - The posting ID.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} The posting record.
     */
    getPosting(postingId, opts = {}) {
      return this._makeRequest({
        path: `/postings/${postingId}`,
        ...opts,
      });
    },
    /**
     * Creates a job posting.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The created posting.
     */
    createPosting(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/postings",
        ...opts,
      });
    },
    /**
     * Lists pipeline stages configured in the account.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of stages (`{ data, hasNext, next }`).
     */
    listStages(opts = {}) {
      return this._makeRequest({
        path: "/stages",
        ...opts,
      });
    },
    /**
     * Lists archive reasons configured in the account.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of archive reasons (`{ data, hasNext, next }`).
     */
    listArchiveReasons(opts = {}) {
      return this._makeRequest({
        path: "/archive_reasons",
        ...opts,
      });
    },
    /**
     * Lists feedback form templates and their field definitions.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of templates (`{ data, hasNext, next }`).
     */
    listFeedbackTemplates(opts = {}) {
      return this._makeRequest({
        path: "/feedback_templates",
        ...opts,
      });
    },
    /**
     * Lists/searches opportunities (candidate applications).
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of opportunities (`{ data, hasNext, next }`).
     */
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    /**
     * Retrieves a single opportunity by ID.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} The opportunity record.
     */
    getOpportunity(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}`,
        ...opts,
      });
    },
    /**
     * Creates an opportunity (candidate + application).
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The created opportunity.
     */
    createOpportunity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        ...opts,
      });
    },
    /**
     * Moves an opportunity to a pipeline stage.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The API response.
     */
    updateOpportunityStage(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/opportunities/${opportunityId}/stage`,
        ...opts,
      });
    },
    /**
     * Archives an opportunity with a reason.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The API response.
     */
    archiveOpportunity(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/opportunities/${opportunityId}/archived`,
        ...opts,
      });
    },
    /**
     * Lists a sub-resource of an opportunity (notes, feedback, interviews,
     * resumes, files, or offers).
     * @param {string} opportunityId - The opportunity ID.
     * @param {string} resource - The sub-resource path segment.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Object>} A paginated list of the sub-resource (`{ data, hasNext, next }`).
     */
    listOpportunityItems(opportunityId, resource, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/${resource}`,
        ...opts,
      });
    },
    /**
     * Adds a note to an opportunity.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The created note.
     */
    addNote(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/notes`,
        ...opts,
      });
    },
    /**
     * Submits a feedback scorecard for an opportunity.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The created feedback.
     */
    submitFeedback(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/feedback`,
        ...opts,
      });
    },
    /**
     * Schedules an interview on an opportunity's panel.
     * @param {string} opportunityId - The opportunity ID.
     * @param {Object} [opts] - Request options (`params`, `data`).
     * @returns {Promise<Object>} The created interview.
     */
    createInterview(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/interviews`,
        ...opts,
      });
    },
    /**
     * Uploads a file to Lever's temporary storage.
     * @param {Object} [opts] - Request options (`headers`, `data`).
     * @returns {Promise<Object>} The upload result containing a temporary `uri`.
     */
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/uploads",
        ...opts,
      });
    },
    /**
     * Downloads a candidate document (resume, file, or offer) as raw bytes.
     * @param {string} opportunityId - The opportunity ID.
     * @param {string} resource - The document type path segment (`resumes`, `files`, or `offers`).
     * @param {string} itemId - The id of the resume/file/offer to download.
     * @param {Object} [opts] - Request options (e.g. `params`).
     * @returns {Promise<Buffer>} The downloaded file contents.
     */
    downloadOpportunityFile(opportunityId, resource, itemId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/${resource}/${itemId}/download`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
