import axios from "axios";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 250;

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID or Name",
      description: "The project's numeric ID (e.g. `4`) or its exact name (e.g. `Isla Nublar Test Lab`). Use **List Projects** to find it.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "The suite's numeric ID. Required when the project's `suite_mode` is 3 (multiple suites); leave empty for single-suite projects. Use **Get Project** to list a project's suites.",
      optional: true,
    },
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "The section's numeric ID. Use **List Sections** to find it.",
    },
    caseId: {
      type: "integer",
      label: "Case ID",
      description: "The test case's numeric ID, without the `C` prefix (e.g. `1065` for case `C1065`). Use **List Cases** to find it.",
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "The test run's numeric ID, without the `R` prefix. Use **List Runs** to find it.",
    },
    testId: {
      type: "integer",
      label: "Test ID",
      description: "The test's numeric ID, without the `T` prefix. A test is one case inside one run; get it from **List Tests**. It is not the case ID.",
    },
    statusIds: {
      type: "integer[]",
      label: "Status IDs",
      description: "Only return items with these status IDs. Defaults: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed. Instances can add custom statuses; use **Get Reference Data** with `type` = `statuses`. Example: `[4, 5]` for Retest and Failed.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum items to return in this call (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT}). If the result has \`hasMore: true\`, call again with \`offset\` set to the returned \`nextOffset\`.`,
      optional: true,
      min: 1,
      max: MAX_LIMIT,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of items to skip (default 0). Use the `nextOffset` from the previous call to get the next page.",
      optional: true,
      min: 0,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Instance-specific custom fields as an object keyed by system name. Use **Get Reference Data** (`case_fields` or `result_fields`) to find the names and types. Example: `{\"custom_steps_separated\": [{\"content\": \"Open the page\", \"expected\": \"Page loads\"}]}`.",
      optional: true,
    },
  },
  methods: {
    // `https://<instance>.testrail.io`, tolerant of a missing scheme, trailing slash or path.
    getHost() {
      const raw = String(this.$auth.api_url || "").trim()
        .replace(/\/+$/, "");
      const withScheme = /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`;
      return withScheme.replace(/\/index\.php.*$/i, "");
    },
    // TestRail routes through the query string (`index.php?/api/v2/get_cases/1&limit=5`),
    // so extra params are appended with `&` by hand: a generic `params` option would add a
    // second `?`, and @pipedream/platform's axios cannot parse a URL like this at all.
    getUrl(path, params = {}) {
      const query = Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && value !== "")
        .map(([
          key,
          value,
        ]) => `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("");
      return `${this.getHost()}/index.php?/api/v2/${path}${query}`;
    },
    async _makeRequest({
      path, params, method = "GET", data,
    }) {
      try {
        const response = await axios({
          method,
          url: this.getUrl(path, params),
          data,
          auth: {
            username: this.$auth.username,
            password: this.$auth.api_key,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (err) {
        // TestRail explains its 4xx in `{ error }` (e.g. "Field :suite_id is a required
        // field"); surface that instead of axios's generic status line so the agent can retry.
        const detail = err.response?.data?.error;
        if (detail) {
          const hint = /suite_id/.test(detail)
            ? " This project has several suites: pass suiteId (use Get Project to list them)."
            : "";
          throw new Error(`TestRail ${err.response.status}: ${detail}${hint}`);
        }
        throw err;
      }
    },
    get(opts) {
      return this._makeRequest({
        method: "GET",
        ...opts,
      });
    },
    post(opts) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    // Resolves a project id or exact project name to the numeric id.
    async resolveProjectId($, project) {
      const value = String(project).trim();
      if (/^\d+$/.test(value)) return Number(value);
      const projects = this.unwrap(await this.get({
        $,
        path: "get_projects",
      }), "projects");
      const matches = projects.filter((p) => p.name.toLowerCase() === value.toLowerCase());
      if (matches.length === 1) return matches[0].id;
      if (!matches.length) {
        throw new Error(`No project named "${value}". Available: ${projects.map((p) => `${p.name} (${p.id})`).join(", ")}`);
      }
      throw new Error(`Several projects are named "${value}": ${matches.map((p) => p.id).join(", ")}. Pass the numeric ID.`);
    },
    // TestRail 6.7+ wraps lists as { offset, limit, size, _links, <key>: [] };
    // older versions return a bare array.
    unwrap(response, key) {
      return Array.isArray(response)
        ? response
        : response?.[key] ?? [];
    },
    // Fetches ONE page and returns { items, size, hasMore, nextOffset }.
    async listPage({
      $, path, key, params = {}, limit, offset,
    }) {
      const pageLimit = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
      const start = offset || 0;
      const response = await this.get({
        $,
        path,
        params: {
          ...params,
          limit: pageLimit,
          offset: start,
        },
      });
      const items = this.unwrap(response, key);
      const hasMore = Array.isArray(response)
        ? items.length === pageLimit
        : Boolean(response?._links?.next);
      return {
        items,
        size: items.length,
        hasMore,
        nextOffset: hasMore
          ? start + items.length
          : null,
      };
    },
    // Keeps `id` plus the requested fields on each object.
    pluck(items, fields) {
      return items.map((item) => Object.fromEntries(
        [
          "id",
          ...fields,
        ].filter((k) => k in item).map((k) => [
          k,
          item[k],
        ]),
      ));
    },
    cleanParams(params) {
      return Object.fromEntries(Object.entries(params).filter(([
        , v,
      ]) => v !== undefined && v !== null && v !== ""));
    },
  },
};
