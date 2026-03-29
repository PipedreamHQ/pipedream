/**
 * ServiceM8 app HTTP and CRUD methods, bound to `@pipedream/platform` axios.
 * @module servicem8/common/methods
 */

import * as logic from "./logic.mjs";
import { buildProduceDocumentJsonBody } from "./payload.mjs";

// ---------------------------------------------------------------------------
// Module-level pure helpers
// ---------------------------------------------------------------------------

/** Trim a value to a non-empty string, or return null. */
function strVal(v) {
  const s = v != null
    ? String(v).trim()
    : "";
  return s || null;
}

/** Extract rows and pagination context from a list API response. */
function extractPageResult(data) {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.items)
      ? data.items
      : [];
  const nextCursor = !Array.isArray(data) && data && typeof data === "object"
    ? (data.cursor ?? data.next_cursor)
    : undefined;
  return {
    rows,
    context: nextCursor
      ? {
        cursor: nextCursor,
      }
      : {},
  };
}

/** Filter options by a query string (label or value, case-insensitive). */
function filterByQuery(options, query) {
  if (!query || !String(query).trim()) {
    return options;
  }
  const q = String(query).trim()
    .toLowerCase();
  return options.filter(
    (o) =>
      String(o.label).toLowerCase()
        .includes(q) ||
      String(o.value).toLowerCase()
        .includes(q),
  );
}

// ---------------------------------------------------------------------------
// Row → label helpers (each returns a string or undefined)
// ---------------------------------------------------------------------------

function labelFromFirstLast(row) {
  const parts = [
    row.first,
    row.last,
  ].map(strVal).filter(Boolean);
  return parts.length
    ? parts.join(" ")
    : undefined;
}

function labelFromNote(row) {
  const text = strVal(row.note);
  if (!text) {
    return undefined;
  }
  return text.length > 60
    ? `${text.slice(0, 60)}…`
    : text;
}

/** jobactivity: API returns start_date / end_date (not start_time / end_time). */
function labelFromActivity(row) {
  const start = row.start_date ?? row.start_time;
  const end = row.end_date ?? row.end_time;
  if (!start && !end) {
    return undefined;
  }
  return [
    start,
    end,
  ].filter(Boolean).join(" → ");
}

/** jobpayment: no single name field; combine method + amount. */
function labelFromPayment(row) {
  const method = strVal(row.method);
  const amount = strVal(row.amount);
  if (!method && !amount) {
    return undefined;
  }
  return [
    method,
    amount,
  ].filter(Boolean).join(" · ");
}

/**
 * Resolve a human-readable label for any ServiceM8 API row.
 * Priority order covers every resource type used across components.
 */
function rowLabel(row, uuid) {
  return (
    row.name ??
    labelFromFirstLast(row) ??
    row.attachment_name ??
    row.company_name ??
    row.job_address ??
    row.subject ??
    row.title ??
    labelFromNote(row) ??
    labelFromActivity(row) ??
    labelFromPayment(row) ??
    row.role_description ??
    String(uuid)
  );
}

// ---------------------------------------------------------------------------
// Methods factory
// ---------------------------------------------------------------------------

/**
 * Factory that returns the `methods` object for the ServiceM8 Pipedream app.
 * @param {import("@pipedream/platform").axios} axios - Platform axios helper
 * @returns {object} Methods merged onto component `this` at runtime
 */
export function createMethods(axios) {
  return {
    /** @returns {string} Base URL for the ServiceM8 API */
    _apiRoot() {
      return "https://api.servicem8.com";
    },

    /** @returns {string} Versioned REST path segment (e.g. `api_1.0`) */
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
     * @param {(status: number) => boolean} [opts.validateStatus]
     */
    async _makeRequest({
      $ = this, path, method = "GET", data, params, headers,
      returnFullResponse = false, formUrlEncoded = false, responseType, validateStatus,
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

    /** @param {string} resource @returns {string} */
    resourceListPath(resource) {
      return logic.resourceListPath(resource);
    },

    /** @param {string} resource @param {string} uuid @returns {string} */
    resourceItemPath(resource, uuid) {
      return logic.resourceItemPath(resource, uuid);
    },

    /** @param {object} opts @returns {Record<string, string>} */
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
     * @param {object|string} data
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
      return this._makeRequest({
        $,
        path: this.resourceItemPath(resource, uuid),
        method: "POST",
        data: this._ensureRecordObject(data),
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

    /** @param {string} jobId - Job UUID */
    getJob(jobId) {
      return this.getResource({
        resource: "job",
        uuid: jobId,
      });
    },

    /** @param {object} opts @param {object} opts.$ */
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
      // String body + explicit Content-Type avoids axios/object + responseType:arraybuffer quirks.
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
        // Return 4xx bodies so actions can parse JSON errors instead of AxiosError Buffer.
        validateStatus: (status) => status >= 200 && status < 600,
      });
    },

    /**
     * Fetch one page of a resource list, returning rows and pagination context.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} [opts.prevContext]
     * @param {object} [opts.extraParams]
     * @returns {Promise<{ rows: object[], context: object }>}
     */
    async _listResourcePage({
      $, resource, prevContext, extraParams = {},
    }) {
      const params = {
        ...extraParams,
        ...(prevContext?.cursor && {
          cursor: prevContext.cursor,
        }),
      };
      const data = await this.listResource({
        $,
        resource,
        params,
      });
      return extractPageResult(data);
    },

    /**
     * Async options for badge `file_name`: list Assets (`read_assets` scope) and map rows to
     * API `file_name` values (asset `name` or `asset_code`).
     * @param {object} opts
     * @param {object} opts.$
     * @param {object} [opts.prevContext]
     * @param {string} [opts.query]
     */
    async _badgeFileNameOptionsFromAssets({
      $, prevContext, query,
    }) {
      const {
        rows, context,
      } = await this._listResourcePage({
        $,
        resource: "asset",
        prevContext,
      });
      const options = rows
        .map((row) => {
          const name = strVal(row.name);
          const code = strVal(row.asset_code);
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
      return {
        options: filterByQuery(options, query),
        context,
      };
    },

    /**
     * Async options for Job `payment_method`: distinct `method` values from job payments.
     * [See the documentation](https://developer.servicem8.com/reference/listjobpayments)
     * @param {object} opts
     * @param {object} opts.$
     * @param {object} [opts.prevContext]
     * @param {string} [opts.query]
     */
    async _paymentMethodOptionsFromJobPayments({
      $, prevContext, query,
    }) {
      const {
        rows, context,
      } = await this._listResourcePage({
        $,
        resource: "jobpayment",
        prevContext,
      });
      const seen = new Set();
      const options = [];
      for (const row of rows) {
        const v = strVal(row.method);
        if (!v || seen.has(v)) {
          continue;
        }
        seen.add(v);
        options.push({
          label: v,
          value: v,
        });
      }
      options.sort((a, b) => String(a.label).localeCompare(String(b.label)));
      return {
        options: filterByQuery(options, query),
        context,
      };
    },

    /**
     * Async options for any resource: list rows and map uuid → human-readable label.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} [opts.prevContext]
     * @param {string} [opts.query]
     * @param {Record<string, string>} [opts.listParams] - Extra query params (e.g. `$filter`)
     * @returns {Promise<{ options: Array<{ label: string, value: string }>, context: object }>}
     */
    async _uuidOptionsForResource({
      $, resource, prevContext, query, listParams = {},
    }) {
      const {
        rows, context,
      } = await this._listResourcePage({
        $,
        resource,
        prevContext,
        extraParams: listParams,
      });
      const options = rows
        .map((row) => {
          const value = row.uuid ?? row.UUID ?? row.id;
          if (!value) {
            return null;
          }
          return {
            label: rowLabel(row, value),
            value,
          };
        })
        .filter(Boolean);
      return {
        options: filterByQuery(options, query),
        context,
      };
    },
  };
}
