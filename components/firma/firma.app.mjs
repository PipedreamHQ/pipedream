import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  DEFAULT_PAGE_SIZE,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "firma",
  propDefinitions: {
    signingRequestId: {
      type: "string",
      label: "Signing Request ID",
      description: "The UUID of a Firma signing request, for example `6f1c2a4e-8b3d-4f5a-9c7e-1d2b3a4c5e6f`. Use **List Signing Requests** to find it; create-and-send and webhook events also return it as `id`.",
      async options({ page }) {
        const { results } = await this.listSigningRequests({
          params: {
            page: page + 1,
            page_size: DEFAULT_PAGE_SIZE,
            exclude_deleted: true,
          },
        });
        return results?.map(({
          id, name, status,
        }) => ({
          label: `${name || id} (${status})`,
          value: id,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The UUID of a Firma template, for example `a12a33db-4d52-41ad-a66b-b45f6dc2830a`. Use **List Templates** to find it.",
      async options({ page }) {
        const { results } = await this.listTemplates({
          params: {
            page: page + 1,
            page_size: DEFAULT_PAGE_SIZE,
          },
        });
        return results?.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        })) || [];
      },
    },
    recipientIds: {
      type: "string[]",
      label: "Recipient IDs",
      description: "The UUIDs of recipients of the signing request, for example `[\"123e4567-e89b-12d3-a456-426614174000\"]`. **List Signing Requests** returns them in each request's `recipients`; the recipient signed webhook event carries one as `data.recipient.id`.",
      async options({ signingRequestId }) {
        if (!signingRequestId) {
          return [];
        }
        const { results } = await this.listSigningRequestUsers({
          signingRequestId,
        });
        return results?.map(({
          id, name, email, designation,
        }) => ({
          label: `${name || email} (${designation})`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    /**
     * Returns the base URL of the Firma API.
     * @returns {string}
     */
    _baseUrl() {
      return BASE_URL;
    },
    /**
     * Returns the request headers. Firma expects the API key itself in the
     * `Authorization` header, without a `Bearer` prefix.
     * @returns {object}
     */
    _headers() {
      return {
        "Authorization": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    /**
     * Sends a request to the Firma API.
     * @param {object} opts
     * @param {object} [opts.$] The step context, for request logging
     * @param {string} opts.path The path below the base URL, for example `/templates`
     * @returns {Promise<object>} The response body
     */
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    /**
     * Lists signing requests, one page at a time (`GET /signing-requests`).
     * @param {object} [opts] Request options; `params` holds the query (`page`,
     * `page_size` up to 200, `status`, `name`, `signer_email`, `signer_name`,
     * `created_after`, `created_before`, `exclude_deleted`, `sort_by`, `sort_order`)
     * @returns {Promise<{results: object[], pagination: object}>}
     */
    listSigningRequests(opts = {}) {
      return this._makeRequest({
        path: "/signing-requests",
        ...opts,
      });
    },
    /**
     * Gets one signing request (`GET /signing-requests/{id}`).
     * @param {object} opts
     * @param {string} opts.signingRequestId The signing request UUID
     * @returns {Promise<object>}
     */
    getSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signing-requests/${encodeURIComponent(signingRequestId)}`,
        ...opts,
      });
    },
    /**
     * Lists the recipients of a signing request (`GET /signing-requests/{id}/users`).
     * @param {object} opts
     * @param {string} opts.signingRequestId The signing request UUID
     * @returns {Promise<{results: object[]}>}
     */
    listSigningRequestUsers({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signing-requests/${encodeURIComponent(signingRequestId)}/users`,
        ...opts,
      });
    },
    /**
     * Creates a signing request and sends it in one call
     * (`POST /signing-requests/create-and-send`).
     * @param {object} opts Request options; `data` holds the request body
     * @returns {Promise<object>} The sent signing request (`status` is `sent`)
     */
    createAndSendSigningRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signing-requests/create-and-send",
        ...opts,
      });
    },
    /**
     * Registers a document upload (`POST /documents`) for documents too large to send
     * inline. Returns `document_id` and a pre-signed `upload_url`, valid for an hour.
     * @param {object} opts Request options; `data` holds `file_name`, `file_size` (bytes,
     * up to 50 MB) and `content_type` (PDF or DOCX)
     * @returns {Promise<{document_id: string, upload_url: string, upload_token: string,
     * expires_in: number}>}
     */
    createDocumentUpload(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    /**
     * Uploads the document bytes to the pre-signed `upload_url` returned by
     * `createDocumentUpload`. The URL carries its own token, so the Firma API key is not
     * sent.
     * @param {object} opts
     * @param {object} [opts.$] The step context, for request logging
     * @param {string} opts.uploadUrl The `upload_url` from `POST /documents`
     * @param {Buffer} opts.content The document bytes
     * @param {string} opts.contentType The content type registered for the document
     * @returns {Promise<object>}
     */
    uploadDocumentContent({
      $ = this, uploadUrl, content, contentType,
    }) {
      return axios($, {
        method: "PUT",
        url: uploadUrl,
        headers: {
          "Content-Type": contentType,
        },
        // An ArrayBuffer, not the Buffer itself: the request helper walks the keys of
        // object bodies, which for a Buffer means one key per byte.
        data: content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
    },
    /**
     * Cancels a sent signing request (`POST /signing-requests/{id}/cancel`).
     * @param {object} opts
     * @param {string} opts.signingRequestId The signing request UUID
     * @returns {Promise<object>}
     */
    cancelSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/signing-requests/${encodeURIComponent(signingRequestId)}/cancel`,
        ...opts,
      });
    },
    /**
     * Resends the signing email to some recipients (`POST /signing-requests/{id}/resend`).
     * @param {object} opts
     * @param {string} opts.signingRequestId The signing request UUID
     * @returns {Promise<object>}
     */
    resendSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/signing-requests/${encodeURIComponent(signingRequestId)}/resend`,
        ...opts,
      });
    },
    /**
     * Gets a pre-signed download URL for the document of a signing request
     * (`GET /signing-requests/{id}/download`). Returns JSON with `download_url`,
     * `expires_at`, `status` and `is_partial`, not the PDF itself.
     * @param {object} opts
     * @param {string} opts.signingRequestId The signing request UUID
     * @returns {Promise<object>}
     */
    downloadSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signing-requests/${encodeURIComponent(signingRequestId)}/download`,
        ...opts,
      });
    },
    /**
     * Lists templates, one page at a time (`GET /templates`).
     * @param {object} [opts] Request options; `params` holds the query (`page`,
     * `page_size` up to 200, `name`, `created_after`, `created_before`, `sort_by`,
     * `sort_order`)
     * @returns {Promise<{results: object[], pagination: object}>}
     */
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    /**
     * Gets one template with its recipients (template users) and fields
     * (`GET /templates/{id}`).
     * @param {object} opts
     * @param {string} opts.templateId The template UUID
     * @returns {Promise<object>}
     */
    getTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${encodeURIComponent(templateId)}`,
        ...opts,
      });
    },
    /**
     * Registers a webhook (`POST /webhooks`). The response does not include the
     * signing secret: Firma signs deliveries with the company or workspace secret
     * shown in the Firma dashboard.
     * @param {object} opts Request options; `data` holds `url`, `events` and an
     * optional `workspace_id`
     * @returns {Promise<object>} The webhook, with its `id`
     */
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    /**
     * Deletes a webhook (`DELETE /webhooks/{id}`).
     * @param {object} opts
     * @param {string} opts.webhookId The webhook UUID
     * @returns {Promise<object>}
     */
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${encodeURIComponent(webhookId)}`,
        ...opts,
      });
    },
  },
};
