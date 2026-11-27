import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  SORT_ORDERS,
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
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The UUID of a Firma workspace, e.g. `0b7c1f7e-2d4a-4b8e-9f3c-6a5d4e3c2b1a`. Use **List Workspaces** to find it (the `id` field); it also appears in the Firma dashboard address when the workspace is open. Set it to register a workspace webhook that receives only that workspace's events; when omitted, a company webhook is registered. Webhooks must be switched on for the company (Settings, Webhook Configuration, Enable Webhooks) or for the workspace in the Firma dashboard, otherwise Firma sends no events.",
      optional: true,
    },
    webhookSecret: {
      type: "string",
      label: "Webhook Signing Secret",
      description: "The webhook signing secret that Firma signs deliveries with, a 64-character hex string, e.g. `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`. For a company webhook it is required: copy it from the Firma dashboard (Settings, Webhook Configuration, Webhook Signing Secret); Firma's API does not return it. When **Workspace ID** is set, leave it empty or paste that workspace's own secret, never the company secret: Firma signs a workspace webhook's deliveries with the workspace's own secret. Left empty, the source reads the workspace's secret from Firma when it is deployed (redeploy after rotating that secret); a pasted value is checked against it on deploy, and a different value stops the deploy before any webhook is registered. Every delivery must carry a valid `X-Firma-Signature` signed less than 5 minutes ago; any other request is answered with 401 and not emitted.",
      secret: true,
      optional: true,
    },
    nameFilter: {
      type: "string",
      label: "Name",
      description: "Only return items whose name contains this text (case-insensitive), e.g. `contract`.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return items created after this ISO 8601 date-time, e.g. `2026-01-31T00:00:00Z`.",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return items created before this ISO 8601 date-time, e.g. `2026-02-28T23:59:59Z`.",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The sort direction, `asc` or `desc`, e.g. `desc`. Defaults to `desc`.",
      optional: true,
      options: SORT_ORDERS,
      default: "desc",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page to return, starting at 1, e.g. `2`. The response's `pagination.total_pages` says how many pages there are. Defaults to `1`.",
      optional: true,
      default: 1,
      min: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: `Items per page, from 1 to ${MAX_PAGE_SIZE}, e.g. \`100\`. Defaults to \`${DEFAULT_PAGE_SIZE}\`.`,
      optional: true,
      default: DEFAULT_PAGE_SIZE,
      min: 1,
      max: MAX_PAGE_SIZE,
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
     * Sends document bytes to a pre-signed upload URL with `PUT`. Unlike `_makeRequest`
     * it never adds the Firma API key: the URL carries its own token, and the key must
     * not travel to the storage host.
     * @param {object} opts
     * @param {object} [opts.$] The step context, for request logging
     * @param {string} opts.url The pre-signed URL, used as given
     * @param {Buffer} opts.content The document bytes
     * @param {string} opts.contentType The content type registered for the document
     * @returns {Promise<object>}
     */
    _uploadRequest({
      $ = this, url, content, contentType,
    }) {
      return axios($, {
        method: "PUT",
        url,
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
      return this._uploadRequest({
        $,
        url: uploadUrl,
        content,
        contentType,
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
     * Lists workspaces, one page at a time (`GET /workspaces`). A workspace API key sees
     * only its own workspace; an account-admin key sees all of them. Each workspace
     * record includes its `api_key` and `test_api_key`.
     * @param {object} [opts] Request options; `params` holds the query (`page`,
     * `page_size` up to 200, `name`, `protected`, `created_after`, `created_before`,
     * `sort_by`, `sort_order`)
     * @returns {Promise<{results: object[], pagination: object}>}
     */
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    /**
     * Gets one workspace (`GET /workspaces/{id}`), including its API keys and its
     * `webhook_secret`.
     * @param {object} opts
     * @param {string} opts.workspaceId The workspace UUID
     * @returns {Promise<object>}
     */
    getWorkspace({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${encodeURIComponent(workspaceId)}`,
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
