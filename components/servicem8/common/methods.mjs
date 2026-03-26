/**
 * ServiceM8 app HTTP and CRUD methods, bound to `@pipedream/platform` axios.
 * @module servicem8/common/methods
 */

import * as logic from "./logic.mjs";
import { buildProduceDocumentJsonBody } from "./payload.mjs";

/**
 * Factory that returns the `methods` object for the ServiceM8 Pipedream app.
 * @param {import("@pipedream/platform").axios} axios - Platform axios helper
 * @returns {object} Methods merged onto component `this` at runtime
 */
export function createMethods(axios) {
  return {
    /**
     * @returns {string} Base URL for the ServiceM8 API
     */
    _apiRoot() {
      return "https://api.servicem8.com";
    },
    /**
     * @returns {string} Versioned REST path segment (e.g. `api_1.0`)
     */
    _apiPath() {
      return logic.API_PATH;
    },
    /**
     * Default headers for authenticated requests.
     * @param {object} [opts]
     * @param {boolean} [opts.json] - When true, include `Content-Type: application/json`
     * @returns {Record<string, string>}
     */
    _authHeaders({ json = false } = {}) {
      const headers = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        /** Prefer JSON responses on `*.json` REST routes (GET/POST/DELETE), not HTML. */
        Accept: "application/json",
      };
      if (json) {
        headers["Content-Type"] = "application/json";
      }
      return headers;
    },
    /**
     * Low-level HTTP helper (uses `@pipedream/platform` axios).
     * @param {object} opts
     * @param {object} [opts.$] - Pipedream context (defaults to `this`)
     * @param {string} opts.path - Path under the API host
     * @param {string} [opts.method]
     * @param {object} [opts.data] - Request body
     * @param {object} [opts.params] - Query string params
     * @param {object} [opts.headers] - Extra headers merged after auth
     * @param {boolean} [opts.returnFullResponse]
     * @param {boolean} [opts.formUrlEncoded] - Send body as `application/x-www-form-urlencoded`
     * @param {string} [opts.responseType] - Axios responseType (e.g. "arraybuffer" for binary)
     * @param {(status: number) => boolean} [opts.validateStatus] - When set, axios returns
     *   non-throwing responses for matching statuses (e.g. read 4xx JSON body).
     */
    async _makeRequest({
      $ = this, path, method = "GET", data, params, headers, returnFullResponse = false,
      formUrlEncoded = false, responseType, validateStatus,
    }) {
      const useJsonBody = !formUrlEncoded && data && method !== "GET" && typeof data === "object";
      const config = {
        url: `${this._apiRoot()}/${path}`,
        method,
        headers: {
          ...this._authHeaders({
            json: useJsonBody,
          }),
          ...headers,
        },
        ...(params && {
          params,
        }),
        ...(data !== undefined && {
          data,
        }),
        returnFullResponse,
        ...(responseType && {
          responseType,
        }),
        ...(validateStatus && {
          validateStatus,
        }),
      };
      if (formUrlEncoded) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      return axios($, config);
    },
    /**
     * @param {string} resource - Resource name used in list URLs
     * @returns {string}
     */
    resourceListPath(resource) {
      return logic.resourceListPath(resource);
    },
    /**
     * @param {string} resource
     * @param {string} uuid
     * @returns {string}
     */
    resourceItemPath(resource, uuid) {
      return logic.resourceItemPath(resource, uuid);
    },
    /**
     * @param {object} opts
     * @returns {Record<string, string>}
     */
    buildListQueryParams(opts) {
      return logic.buildListQueryParams(opts);
    },
    /**
     * List records for a resource with optional filter/sort/cursor (pagination).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} [opts.params]
     */
    async listResource({
      $, resource, params = {},
    }) {
      return this._makeRequest({
        $,
        path: this.resourceListPath(resource),
        params,
      });
    },
    /**
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {string} opts.uuid
     */
    async getResource({
      $, resource, uuid,
    }) {
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
      });
    },
    /**
     * Ensure data is an object (parse JSON string if needed).
     * @param {object|string} data - Record data from props
     * @returns {object}
     */
    _ensureRecordObject(data) {
      if (data == null) {
        return {};
      }
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return {};
        }
      }
      return typeof data === "object"
        ? data
        : {};
    },
    /**
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object|string} opts.data
     * @returns {Promise<{ body: unknown, recordUuid?: string }>}
     */
    async createResource({
      $, resource, data,
    }) {
      const payload = this._ensureRecordObject(data);
      const res = await this._makeRequest({
        $,
        path: this.resourceListPath(resource),
        method: "POST",
        data: payload,
        returnFullResponse: true,
      });
      const recordUuid = res.headers["x-record-uuid"] ?? res.headers["X-Record-Uuid"];
      return {
        body: res.data,
        recordUuid,
      };
    },
    /**
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {string} opts.uuid
     * @param {object} opts.data
     */
    async updateResource({
      $, resource, uuid, data,
    }) {
      const payload = this._ensureRecordObject(data);
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
        method: "POST",
        data: payload,
      });
    },
    /**
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {string} opts.uuid
     */
    async deleteResource({
      $, resource, uuid,
    }) {
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
        method: "DELETE",
      });
    },
    /**
     * @param {string} jobId - Job UUID
     */
    getJob(jobId) {
      return this.getResource({
        resource: "job",
        uuid: jobId,
      });
    },
    /**
     * @param {object} opts
     * @param {object} opts.$
     */
    async listWebhooks({ $ }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "GET",
      });
    },
    /**
     * Create or update a webhook subscription (POST body must be form-encoded).
     * @param {object} opts
     * @param {object} [opts.$]
     * @param {string} opts.data - URL-encoded body
     */
    setHook({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "POST",
        data,
        formUrlEncoded: true,
      });
    },
    /**
     * Delete a webhook subscription (form-encoded body).
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.data - URL-encoded body
     */
    removeHook({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "webhook_subscriptions",
        method: "DELETE",
        data,
        formUrlEncoded: true,
      });
    },
    /**
     * Messaging API (requires `publish_sms` scope).
     * @param {object} opts
     * @param {object} opts.$
     * @param {object} opts.data
     */
    async sendSms({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "platform_service_sms",
        method: "POST",
        data,
      });
    },
    /**
     * Messaging API (requires `publish_email` scope).
     * @param {object} opts
     * @param {object} opts.$
     * @param {object} opts.data
     * @param {object} [opts.headers]
     */
    async sendEmail({
      $, data, headers,
    }) {
      return this._makeRequest({
        $,
        path: "platform_service_email",
        method: "POST",
        data,
        headers,
      });
    },
    /**
     * Produce a templated document (Quote, Work Order, or Invoice) for a job.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.objectType - Record type (e.g. "Job")
     * @param {string} opts.objectUUID - Job UUID
     * @param {string} opts.templateType - "Quote", "Work Order", or "Invoice"
     * @param {string} [opts.templateUUID] - Optional template UUID
     * @param {string} opts.outputFormat - "pdf", "docx", or "jpg"
     * @param {boolean} [opts.storeToDiary] - Attach produced doc to job diary
     */
    async produceTemplatedDocument({
      $, objectType, objectUUID, templateType, templateUUID, outputFormat, storeToDiary,
    }) {
      /**
       * String body + explicit `Content-Type` avoids axios/object + `responseType: arraybuffer`
       * quirks.
       */
      const data = buildProduceDocumentJsonBody({
        objectType,
        objectUUID,
        templateType,
        templateUUID,
        outputFormat,
        storeToDiary,
      });
      return this._makeRequest({
        $,
        path: "platform_produce_document",
        method: "POST",
        data,
        returnFullResponse: true,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, application/pdf, application/octet-stream, */*",
        },
        /**
         * Return 4xx bodies so actions can parse JSON errors instead of AxiosError Buffer.
         */
        validateStatus: (status) => status >= 200 && status < 600,
      });
    },
    /**
     * Options for dropdowns: list resource rows and map `uuid` to labels.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} [opts.prevContext]
     * @param {string} [opts.prevContext.cursor]
     * @param {Record<string, string>} [opts.listParams] - Extra query params for list requests
     *   (e.g. `$filter`).
     * @returns {Promise<object>}
     */
    /**
     * Async options for badge `file_name`: list Assets (`read_assets` scope) and map rows to
     * API `file_name` values (asset `name` or `asset_code`).
     * @param {object} opts
     * @param {object} opts.$
     * @param {object} [opts.prevContext]
     * @param {string} [opts.prevContext.cursor]
     * @param {string} [opts.query]
     */
    async _badgeFileNameOptionsFromAssets({
      $, prevContext, query,
    }) {
      const params = {};
      if (prevContext?.cursor) {
        params.cursor = prevContext.cursor;
      }
      const data = await this.listResource({
        $,
        resource: "asset",
        params,
      });
      const rows = Array.isArray(data)
        ? data
        : (data && typeof data === "object" && Array.isArray(data.items))
          ? data.items
          : [];
      const nextCursor = (data && typeof data === "object" && !Array.isArray(data))
        ? (data.cursor ?? data.next_cursor)
        : undefined;
      const context = {};
      if (nextCursor) {
        context.cursor = nextCursor;
      }
      let options = rows
        .map((row) => {
          const name = row.name != null && String(row.name).trim() !== ""
            ? String(row.name).trim()
            : null;
          const code = row.asset_code != null && String(row.asset_code).trim() !== ""
            ? String(row.asset_code).trim()
            : null;
          const value = code ?? name;
          if (!value) {
            return null;
          }
          const id = row.uuid ?? row.UUID;
          const labelParts = [
            name ?? code,
            code && name && code !== name
              ? code
              : null,
            id,
          ].filter(Boolean);
          return {
            label: labelParts.join(" · "),
            value,
          };
        })
        .filter(Boolean);
      if (query && String(query).trim()) {
        const q = String(query).trim()
          .toLowerCase();
        options = options.filter((o) => String(o.label).toLowerCase()
          .includes(q)
          || String(o.value).toLowerCase()
            .includes(q));
      }
      return {
        options,
        context,
      };
    },
    async _uuidOptionsForResource({
      $, resource, prevContext, query, listParams = {},
    }) {
      const params = {
        ...listParams,
      };
      if (prevContext?.cursor) {
        params.cursor = prevContext.cursor;
      }
      const data = await this.listResource({
        $,
        resource,
        params,
      });
      const rows = Array.isArray(data)
        ? data
        : (data && typeof data === "object" && Array.isArray(data.items))
          ? data.items
          : [];
      const nextCursor = (data && typeof data === "object" && !Array.isArray(data))
        ? (data.cursor ?? data.next_cursor)
        : undefined;
      const context = {};
      if (nextCursor) {
        context.cursor = nextCursor;
      }
      let options = rows
        .map((row) => {
          const value = row.uuid ?? row.UUID ?? row.id;
          if (!value) {
            return null;
          }
          const nameFromFirstLast = (() => {
            const parts = [
              row.first,
              row.last,
            ].filter((v) => v != null && String(v).trim() !== "")
              .map((v) => String(v).trim());
            return parts.length
              ? parts.join(" ")
              : undefined;
          })();
          const label =
            row.name
            ?? nameFromFirstLast
            ?? row.company_name
            ?? row.job_address
            ?? row.subject
            ?? row.title
            ?? row.start_time
            ?? row.end_time
            ?? row.role_description
            ?? String(value);
          return {
            label,
            value,
          };
        })
        .filter(Boolean);
      if (query && String(query).trim()) {
        const q = String(query).trim()
          .toLowerCase();
        options = options.filter((o) => String(o.label).toLowerCase()
          .includes(q)
          || String(o.value).toLowerCase()
            .includes(q));
      }
      return {
        options,
        context,
      };
    },
  };
}
