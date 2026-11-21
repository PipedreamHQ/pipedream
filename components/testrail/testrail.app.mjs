import { axios } from "@pipedream/platform";

const PAGE_SIZE = 250;

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The numeric ID of the TestRail project. Use **List Projects** to find it. Example: `4`.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "The numeric ID of the test suite. Required for projects in multi-suite mode (`suite_mode` 3 in **List Projects**); leave empty for single-suite projects. Use **List Suites** to find it. Example: `28`.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "The numeric ID of the test run. Use **List Runs** to find it. Example: `86`.",
    },
    testId: {
      type: "integer",
      label: "Test ID",
      description: "The numeric ID of a test (a case inside one run, not the case ID). Use **List Tests** to find it. Example: `4124`.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of records to return. Pages of 250 are fetched until this many are collected. Defaults to 100; the maximum is 1000.",
      optional: true,
      min: 1,
      max: 1000,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of records to skip, to continue after a truncated response. Use the `next_offset` value from the previous response. Defaults to 0.",
      optional: true,
      min: 0,
    },
  },
  methods: {
    _origin() {
      const raw = String(this.$auth.api_url || "").trim();
      const withProtocol = raw.includes("://")
        ? raw
        : `https://${raw}`;
      return new URL(withProtocol).origin;
    },
    // TestRail routes through the query string (`index.php?/api/v2/<path>&k=v`). The platform's
    // axios rewrites any URL query into `params` and chokes on that shape, so the route and the
    // extra params are rebuilt by a custom paramsSerializer instead.
    _query(path, params = {}) {
      const extra = Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && value !== "")
        .map(([
          key,
          value,
        ]) => `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("");
      return `/api/v2/${path}${extra}`;
    },
    caseUrl(caseId) {
      return `${this._origin()}/index.php?/cases/view/${caseId}`;
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._origin()}/index.php`,
        params: {
          route: path,
        },
        paramsSerializer: () => this._query(path, params),
        auth: {
          username: this.$auth.username,
          password: this.$auth.api_key,
        },
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    getProjects(opts = {}) {
      return this._makeRequest({
        path: "get_projects",
        ...opts,
      });
    },
    getStatuses(opts = {}) {
      return this._makeRequest({
        path: "get_statuses",
        ...opts,
      });
    },
    getCaseFields(opts = {}) {
      return this._makeRequest({
        path: "get_case_fields",
        ...opts,
      });
    },
    getResultFields(opts = {}) {
      return this._makeRequest({
        path: "get_result_fields",
        ...opts,
      });
    },
    getTest({
      testId, ...opts
    }) {
      return this._makeRequest({
        path: `get_test/${testId}`,
        ...opts,
      });
    },
    addResult({
      testId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_result/${testId}`,
        ...opts,
      });
    },
    addSection({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_section/${projectId}`,
        ...opts,
      });
    },
    addCase({
      sectionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_case/${sectionId}`,
        ...opts,
      });
    },
    /**
     * Fetch a TestRail list endpoint page by page until `maxResults` records are collected.
     * Handles both response shapes (`{ <key>: [...], _links }` on TestRail 6.7+, bare arrays on
     * older servers). Returns the records, whether more exist, and the offset to continue from.
     */
    async paginate({
      $, path, key, params = {}, maxResults = 100, offset = 0,
    }) {
      const items = [];
      let nextOffset = offset;
      let hasMore = false;
      while (items.length < maxResults) {
        const limit = Math.min(PAGE_SIZE, maxResults - items.length);
        const response = await this._makeRequest({
          $,
          path,
          params: {
            ...params,
            limit,
            offset: nextOffset,
          },
        });
        const page = Array.isArray(response)
          ? response
          : response?.[key] ?? [];
        items.push(...page);
        nextOffset += page.length;
        const wrapped = !Array.isArray(response) && response?._links;
        hasMore = wrapped
          ? Boolean(response._links.next)
          : page.length === limit;
        if (!hasMore || !page.length) {
          hasMore = hasMore && page.length > 0;
          break;
        }
      }
      return {
        items,
        has_more: hasMore,
        next_offset: hasMore
          ? nextOffset
          : null,
      };
    },
  },
};
