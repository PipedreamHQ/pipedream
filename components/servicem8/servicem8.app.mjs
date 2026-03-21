import { axios } from "@pipedream/platform";

/**
 * Build a prop definition that loads UUIDs for a ServiceM8 list resource via async options.
 * @param {string} resource - API resource segment (e.g. `job`, `companycontact`)
 * @param {string} label - UI label for the prop
 * @param {string} noun - Short noun for the description (e.g. `job`, `company`)
 * @returns {object} Pipedream prop definition with async options
 */
function makeResourceUuidProp(resource, label, noun) {
  return {
    type: "string",
    label,
    description: `Select a ${noun} or enter its UUID`,
    async options({
      $, prevContext,
    }) {
      return this._uuidOptionsForResource({
        $,
        resource,
        prevContext,
      });
    },
  };
}

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {
    filter: {
      type: "string",
      label: "$filter",
      optional: true,
      description: "OData-style filter expression. [Filtering documentation](https://developer.servicem8.com/docs/filtering)",
    },
    sort: {
      type: "string",
      label: "$sort",
      optional: true,
      description: "Sort expression (e.g. `edit_date desc`)",
    },
    cursor: {
      type: "string",
      label: "cursor",
      optional: true,
      description: "Pagination cursor from a previous list response. Pass the cursor from the prior page to retrieve the next page until no cursor is returned.",
    },
    record: {
      type: "object",
      label: "Record",
      description: "JSON object of fields for the ServiceM8 API request body. Updates use POST (not PATCH); include the full set of fields to persist—omitted fields may be cleared.",
    },
    jobUuid: makeResourceUuidProp("job", "Job", "job"),
    companyUuid: makeResourceUuidProp("company", "Company", "company"),
    jobactivityUuid: makeResourceUuidProp("jobactivity", "Job Activity", "job activity"),
    jobpaymentUuid: makeResourceUuidProp("jobpayment", "Job Payment", "job payment"),
    categoryUuid: makeResourceUuidProp("category", "Category", "category"),
    jobmaterialUuid: makeResourceUuidProp("jobmaterial", "Job Material", "job material"),
    staffUuid: makeResourceUuidProp("staff", "Staff", "staff member"),
    badgeUuid: makeResourceUuidProp("badge", "Badge", "badge"),
    dboattachmentUuid: makeResourceUuidProp("dboattachment", "Attachment", "attachment"),
    companycontactUuid: makeResourceUuidProp("companycontact", "Company Contact", "company contact"),
    jobcontactUuid: makeResourceUuidProp("jobcontact", "Job Contact", "job contact"),
    noteUuid: makeResourceUuidProp("note", "Note", "note"),
    queueUuid: makeResourceUuidProp("queue", "Queue", "queue"),
    feedbackUuid: makeResourceUuidProp("feedback", "Feedback", "feedback item"),
  },
  methods: {
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
      return "api_1.0";
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
     *   (`api_1.0/...` or `webhook_subscriptions`, etc.)
     * @param {string} [opts.method]
     * @param {object} [opts.data] - Request body
     * @param {object} [opts.params] - Query string params (e.g. `$filter`, `cursor`)
     * @param {object} [opts.headers] - Extra headers merged after auth
     * @param {boolean} [opts.returnFullResponse]
     * @param {boolean} [opts.formUrlEncoded] - Send body as `application/x-www-form-urlencoded`
     */
    async _makeRequest({
      $ = this, path, method = "GET", data, params, headers, returnFullResponse = false,
      formUrlEncoded = false,
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
      };
      if (formUrlEncoded) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      return axios($, config);
    },
    /**
     * @param {string} resource - Resource name used in list URLs (e.g. `job` → `api_1.0/job.json`)
     * @returns {string}
     */
    resourceListPath(resource) {
      return `${this._apiPath()}/${resource}.json`;
    },
    /**
     * @param {string} resource
     * @param {string} uuid
     * @returns {string}
     */
    resourceItemPath(resource, uuid) {
      return `${this._apiPath()}/${resource}/${uuid}.json`;
    },
    /**
     * Map list-action props to ServiceM8 query parameters (`$filter`, `$sort`, `cursor`).
     * Omits empty strings so unset optional props are not sent.
     * @param {object} opts
     * @param {string} [opts.filter]
     * @param {string} [opts.sort]
     * @param {string} [opts.cursor]
     * @returns {Record<string, string>}
     */
    buildListQueryParams({
      filter, sort, cursor,
    }) {
      const params = {};
      if (filter !== undefined && filter !== "") params.$filter = filter;
      if (sort !== undefined && sort !== "") params.$sort = sort;
      if (cursor !== undefined && cursor !== "") params.cursor = cursor;
      return params;
    },
    /**
     * List records for a resource with optional filter/sort/cursor (pagination).
     * @param {object} opts
     * @param {object} opts.$ - Pipedream context
     * @param {string} opts.resource - Resource key (e.g. `job`)
     * @param {object} [opts.params] - Query params (use {@link buildListQueryParams})
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
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} opts.data - JSON body
     * @returns {Promise<{ body: unknown, recordUuid?: string }>}
     */
    async createResource({
      $, resource, data,
    }) {
      const res = await this._makeRequest({
        $,
        path: this.resourceListPath(resource),
        method: "POST",
        data,
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
        data,
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
     * @param {string} opts.data - URL-encoded body (e.g. `callback_url=...&object=Job`)
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
     * @param {string} opts.data - URL-encoded body (e.g. `object=Job`)
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
     * @param {object} opts.data - Request body per [send_sms](https://developer.servicem8.com/reference/send_sms)
     * @see https://developer.servicem8.com/reference/send_sms
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
     * @param {object} opts.data - Request body per [send_email](https://developer.servicem8.com/reference/send_email)
     * @param {object} [opts.headers] - e.g. `x-impersonate-uuid`
     * @see https://developer.servicem8.com/reference/send_email
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
     * Options for dropdowns: list resource rows and map `uuid` to labels.
     * Uses `cursor` from the list response when present for pagination in the UI.
     * @param {object} opts
     * @param {object} opts.$
     * @param {string} opts.resource
     * @param {object} [opts.prevContext]
     * @param {string} [opts.prevContext.cursor]
     * @returns {Promise<object>} Dropdown options and optional cursor context
     */
    async _uuidOptionsForResource({
      $, resource, prevContext,
    }) {
      const params = {};
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
      return {
        options: rows
          .map((row) => {
            const value = row.uuid ?? row.UUID;
            if (!value) {
              return null;
            }
            const label =
              row.name
              ?? row.company_name
              ?? row.job_address
              ?? row.subject
              ?? row.title
              ?? String(value);
            return {
              label,
              value,
            };
          })
          .filter(Boolean),
        context,
      };
    },
  },
};
