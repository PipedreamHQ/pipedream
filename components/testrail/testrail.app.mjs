import { axios } from "@pipedream/platform";

const PAGE_SIZE = 250;
const EPOCH_FIELDS = [
  "created_on",
  "updated_on",
  "completed_on",
  "archived_on",
  "start_on",
  "due_on",
];
const FIELD_TYPES = {
  1: "string",
  2: "integer",
  3: "text",
  4: "url",
  5: "checkbox",
  6: "dropdown",
  7: "user",
  8: "date",
  9: "milestone",
  10: "steps",
  11: "step_results",
  12: "multiselect",
  13: "scenario",
};

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The numeric ID of the TestRail project, e.g. `4`. Use **List Projects** to find it by name.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "The numeric ID of the test suite, e.g. `15`. Required when the project uses multiple suites (the project's `suite_mode` is 3); leave empty for single-suite projects. Use **List Suites** to find it.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most items to return across all pages. Pages of 250 are fetched until this many are collected or the data runs out. Defaults to 250; the maximum is 1000. If more exist, the response says `truncated: true`, so raise this or narrow the filters.",
      optional: true,
      default: 250,
      min: 1,
      max: 1000,
    },
  },
  methods: {
    _baseUrl() {
      const raw = String(this.$auth.api_url || "").trim()
        .replace(/\/+$/, "");
      const url = /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`;
      return `${url}/index.php`;
    },
    // TestRail routes through the query string (`index.php?/api/v2/<endpoint>&limit=250`). The
    // platform's axios wrapper cannot parse that URL, so the route is put in front of the
    // serialized params instead.
    _makeRequest({
      $ = this, endpoint, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: params || {},
        paramsSerializer: (p) => {
          const rest = Object.entries(p)
            .filter(([
              , v,
            ]) => v !== undefined && v !== null && v !== "")
            .map(([
              k,
              v,
            ]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
          return [
            `/api/v2/${endpoint}`,
            ...rest,
          ].join("&");
        },
        auth: {
          username: this.$auth.username,
          password: this.$auth.api_key,
        },
        ...opts,
      });
    },
    // Fetch pages of a list endpoint. TestRail 7+ returns {offset, limit, size, _links, <key>: []};
    // older servers return a bare array. Returns the items and whether more remain.
    async paginate({
      $, endpoint, key, params = {}, maxResults = PAGE_SIZE,
    }) {
      const cap = Math.min(maxResults || PAGE_SIZE, 1000);
      const items = [];
      let offset = 0;
      let truncated = false;
      while (items.length < cap) {
        const limit = Math.min(PAGE_SIZE, cap - items.length);
        const res = await this._makeRequest({
          $,
          endpoint,
          params: {
            ...params,
            limit,
            offset,
          },
        });
        if (Array.isArray(res)) {
          items.push(...res.slice(0, cap - items.length));
          truncated = res.length > cap;
          break;
        }
        const page = res[key] || [];
        items.push(...page);
        const hasNext = Boolean(res._links?.next);
        if (!hasNext || !page.length) break;
        if (items.length >= cap) {
          truncated = true;
          break;
        }
        offset += page.length;
      }
      return {
        items: items.slice(0, cap),
        truncated,
      };
    },
    // Resolve a name, label or numeric id against a lookup endpoint (statuses, priorities, types).
    async resolveId({
      $, endpoint, value, kind,
    }) {
      if (value === undefined || value === null || value === "") return undefined;
      if (/^\d+$/.test(String(value).trim())) return Number(value);
      const wanted = String(value).trim()
        .toLowerCase();
      const list = await this._makeRequest({
        $,
        endpoint,
      });
      const match = list.find((item) => [
        item.name,
        item.label,
        item.short_name,
      ].some((n) => n && String(n).toLowerCase() === wanted));
      if (!match) {
        const valid = list.map((item) => `${item.label || item.name} (${item.id})`).join(", ");
        throw new Error(`Unknown ${kind} "${value}". Valid values: ${valid}`);
      }
      return match.id;
    },
    resolveStatus($, value) {
      return this.resolveId({
        $,
        endpoint: "get_statuses",
        value,
        kind: "status",
      });
    },
    resolvePriority($, value) {
      return this.resolveId({
        $,
        endpoint: "get_priorities",
        value,
        kind: "priority",
      });
    },
    resolveCaseType($, value) {
      return this.resolveId({
        $,
        endpoint: "get_case_types",
        value,
        kind: "case type",
      });
    },
    async resolveStatusList($, values) {
      if (!values?.length) return undefined;
      const ids = [];
      for (const v of values) ids.push(await this.resolveStatus($, v));
      return ids.join(",");
    },
    // Epoch seconds -> ISO strings so the model never has to convert.
    withIsoDates(obj) {
      if (!obj || typeof obj !== "object") return obj;
      const out = {
        ...obj,
      };
      for (const f of EPOCH_FIELDS) {
        if (typeof out[f] === "number") out[f] = new Date(out[f] * 1000).toISOString();
      }
      return out;
    },
    // Keep `id` plus the requested fields; with no field list, keep the curated defaults.
    shape(obj, fields, defaults) {
      const src = this.withIsoDates(obj);
      const names = fields?.length
        ? fields
        : defaults;
      return Object.fromEntries(
        [
          "id",
          ...names,
        ].filter((k) => k in src).map((k) => [
          k,
          src[k],
        ]),
      );
    },
    // A missing suite_id on a multi-suite project comes back as a bare 400; say what to do.
    suiteHint(err, suiteId) {
      if (!suiteId && err?.response?.status === 400) {
        return new Error("TestRail rejected the request with HTTP 400. If this project uses multiple suites (suite_mode 3 in List Projects), pass suiteId; use List Suites to find it. "
          + `Details: ${JSON.stringify(err.response.data)}`);
      }
      return err;
    },
    parseJsonObject(text, label) {
      if (text === undefined || text === null || text === "") return {};
      let parsed = text;
      if (typeof text === "string") {
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          throw new Error(`${label} must be a JSON object such as {"custom_preconds": "Logged in"}`);
        }
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error(`${label} must be a JSON object such as {"custom_preconds": "Logged in"}`);
      }
      return parsed;
    },
    describeField(field) {
      const options = field.configs?.[0]?.options || {};
      return {
        system_name: field.system_name,
        label: field.label,
        type: FIELD_TYPES[field.type_id] || field.type_id,
        is_required: Boolean(options.is_required),
        items: options.items,
        default_value: options.default_value || undefined,
        template_ids: field.template_ids,
        description: field.description || undefined,
      };
    },
    getCurrentUser($) {
      return this._makeRequest({
        $,
        endpoint: "get_current_user",
      });
    },
  },
};
