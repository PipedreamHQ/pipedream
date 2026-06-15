import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "emboss",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form",
      description: "A ready Emboss form to fill.",
      async options({ page }) {
        const { forms = [] } = await this.listForms({
          params: {
            page,
          },
        });
        return forms.map((f) => ({
          label: f.title || f.id,
          value: f.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getemboss.ai";
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
     * List the account's ready forms.
     * @param {object} [opts] - Extra request options (e.g. `params.page`).
     * @returns {Promise<object>} `{ forms: [...] }`.
     */
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    /**
     * Create a fillable form from a flat PDF (async job).
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
     * Get a form's processing status.
     * @param {object} opts - Request options.
     * @param {string} opts.formId - The form ID.
     * @returns {Promise<object>} `{ status, error?, ... }`.
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
     * @returns {Promise<object>} `{ status, session_id?, report?, error? }`.
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
     * Render a ready session's filled PDF (required before downloading it).
     * @param {object} opts - Request options.
     * @param {string} opts.sessionId - The session ID.
     * @returns {Promise<object>} `{ session_id, status }`.
     */
    fillSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sessions/${sessionId}/fill`,
        ...opts,
      });
    },
    /**
     * Download a filled session's PDF.
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
