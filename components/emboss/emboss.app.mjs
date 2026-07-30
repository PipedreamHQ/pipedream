import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.getemboss.ai";

export default {
  type: "app",
  app: "emboss",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of a previously created, ready Emboss form. Use the **List Forms** action to look up available forms, or copy the `form_id` returned by **Create Fillable Form**, e.g. `6c47f7f5-f921-4698-910f-95dd7d81310b`.",
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    /**
     * Make an authenticated request to the Emboss API.
     * @param {object} opts - Request options.
     * @param {object} [opts.$] - The Pipedream run context (defaults to `this`).
     * @param {string} opts.path - API path, e.g. `/forms`.
     * @returns {Promise<object>} The response data.
     */
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    /**
     * Create a form by uploading a flat PDF (async field detection).
     * @param {object} opts - Request options carrying the multipart body.
     * @returns {Promise<object>} `{ form_id, status }`.
     */
    createForm(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms",
        ...opts,
      });
    },
    /**
     * Get a form's detection status.
     * @param {object} opts - Request options.
     * @param {string} opts.formId - The form ID.
     * @returns {Promise<object>} `{ id, status, title, schema_version, error? }`.
     */
    getForm({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}`,
        ...opts,
      });
    },
    /**
     * List the account's forms.
     * @param {object} [opts] - Extra request options (e.g. `params.page`).
     * @returns {Promise<object>} `{ forms: [{ id, title, status }] }`.
     */
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    /**
     * Download a ready form's fillable PDF.
     * @param {object} opts - Request options.
     * @param {string} opts.formId - The form ID.
     * @returns {Promise<ArrayBuffer>} The PDF bytes.
     */
    getFillablePdf({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/fillable`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
    /**
     * Upload a flat PDF + context documents; AI-fill it (async job).
     * @param {object} opts - Request options carrying the multipart body.
     * @returns {Promise<object>} `{ job_id }`.
     */
    createWithContext(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/with-context",
        ...opts,
      });
    },
    /**
     * Fill an EXISTING form from context documents (async job).
     * @param {object} opts - Request options carrying the multipart body.
     * @param {string} opts.formId - The form ID.
     * @returns {Promise<object>} `{ job_id }`.
     */
    fillExistingForm({
      formId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/with-context`,
        ...opts,
      });
    },
    /**
     * Get a context-fill job's status.
     * @param {object} opts - Request options.
     * @param {string} opts.jobId - The job ID.
     * @returns {Promise<object>} `{ status, session_id?, error? }`.
     */
    getContextJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/with-context/${jobId}`,
        ...opts,
      });
    },
    /**
     * Download a completed session's rendered PDF.
     * @param {object} opts - Request options.
     * @param {string} opts.sessionId - The session ID.
     * @returns {Promise<ArrayBuffer>} The PDF bytes.
     */
    getSessionPdf({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}/pdf`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
