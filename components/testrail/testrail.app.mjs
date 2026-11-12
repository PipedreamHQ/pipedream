import axios from "axios";

const PAGE_SIZE = 250;
const SUITE_BATCH = 5;
const SYSTEM_STATUSES = {
  passed: 1,
  blocked: 2,
  untested: 3,
  retest: 4,
  failed: 5,
};

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "TestRail project id. Use **List Projects** to find it by name.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "Suite id. Only needed for multi-suite projects (see `suite_mode` in **List Projects**: 3 = multiple suites). Leave empty to cover every suite in the project. Use **Get Metadata** with `include=[\"suites\"]` to list suites.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Test run id. Use **List Runs** to find it.",
    },
    testId: {
      type: "integer",
      label: "Test ID",
      description: "Test id (not the case id): a test is one case inside one run. Use **List Tests** to find it.",
    },
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "Section id. Use **List Sections** to find it.",
    },
  },
  methods: {
    /** `https://<instance>.testrail.io`, tolerant of a missing scheme or trailing slash/path. */
    _host() {
      const raw = String(this.$auth.api_url || "").trim()
        .replace(/\/+$/, "");
      const withScheme = /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`;
      return withScheme.replace(/\/index\.php.*$/i, "");
    },
    /**
     * TestRail routes through the query string (`index.php?/api/v2/get_cases/1&suite_id=2`),
     * so extra params are appended with `&`. A generic `params` option would add a second `?`.
     */
    _url(endpoint, params = {}) {
      const query = Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && value !== "")
        .map(([
          key,
          value,
        ]) => `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("");
      return `${this._host()}/index.php?/api/v2/${endpoint}${query}`;
    },
    async _makeRequest({
      endpoint, params, method = "GET", data,
    }) {
      try {
        const { data: body } = await axios({
          method,
          url: this._url(endpoint, params),
          data,
          auth: {
            username: this.$auth.username,
            password: this.$auth.api_key,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        return body;
      } catch (err) {
        // TestRail explains its 400s in `{ error }` (e.g. "Field :suite_id is a required
        // field"); surface that instead of axios's generic status line so the agent can retry.
        const detail = err.response?.data?.error;
        if (detail) {
          throw new Error(`TestRail ${err.response.status}: ${detail}`);
        }
        throw err;
      }
    },
    /**
     * Fetches a TestRail list, following `offset` pages (250 per page) until `limit` items are
     * collected or the list ends. `collection` is the response key (`cases`, `runs`...).
     * Older instances return a bare array; that is handled too.
     */
    async paginate({
      endpoint, params = {}, collection, limit = PAGE_SIZE,
    }) {
      const items = [];
      let truncated = false;
      let offset = 0;
      while (items.length < limit) {
        const pageSize = Math.min(PAGE_SIZE, limit - items.length);
        const page = await this._makeRequest({
          endpoint,
          params: {
            ...params,
            limit: pageSize,
            offset,
          },
        });
        const batch = Array.isArray(page)
          ? page
          : page[collection] || [];
        items.push(...batch);
        const hasNext = Array.isArray(page)
          ? batch.length === pageSize
          : Boolean(page._links?.next);
        if (!hasNext || !batch.length) break;
        offset += batch.length;
        if (items.length >= limit) truncated = true;
      }
      return {
        items,
        truncated,
      };
    },
    /**
     * Suite ids to query for a project. An explicit `suiteId` wins. Single-suite projects
     * (suite_mode 1 and 2) take no suite id and yield `[undefined]`; multi-suite projects
     * (suite_mode 3) need one, so every non-completed suite is returned.
     */
    async resolveSuiteIds(projectId, suiteId) {
      if (suiteId) {
        return [
          suiteId,
        ];
      }
      const project = await this._makeRequest({
        endpoint: `get_project/${projectId}`,
      });
      if (project.suite_mode !== 3) {
        return [
          undefined,
        ];
      }
      const { items } = await this.paginate({
        endpoint: `get_suites/${projectId}`,
        collection: "suites",
      });
      return items.map(({ id }) => id);
    },
    /**
     * Runs `fetchOne(suiteId)` for each suite, SUITE_BATCH at a time, and concatenates the
     * results. Each call returns `{ items, truncated }`.
     */
    async collectAcrossSuites(suiteIds, fetchOne) {
      const items = [];
      let truncated = false;
      for (let i = 0; i < suiteIds.length; i += SUITE_BATCH) {
        const results = await Promise.all(
          suiteIds.slice(i, i + SUITE_BATCH).map((id) => fetchOne(id)),
        );
        for (const result of results) {
          items.push(...result.items);
          truncated = truncated || result.truncated;
        }
      }
      return {
        items,
        truncated,
      };
    },
    /** Status id from an id ("5") or label ("Failed"). Custom statuses are looked up. */
    async resolveStatusId(status) {
      const text = String(status).trim();
      if (/^\d+$/.test(text)) return Number(text);
      const known = SYSTEM_STATUSES[text.toLowerCase()];
      if (known) return known;
      const statuses = await this._makeRequest({
        endpoint: "get_statuses",
      });
      const wanted = text.toLowerCase();
      const match = statuses.find((s) => [
        s.label,
        s.name,
      ].some((v) => String(v).toLowerCase() === wanted));
      if (!match) {
        throw new Error(`Unknown status "${status}". Available: ${statuses.map((s) => `${s.label} (${s.id})`).join(", ")}`);
      }
      return match.id;
    },
  },
};
