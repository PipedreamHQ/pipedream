import axios from "axios";

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Numeric TestRail project ID. Use **List Projects** to find it by project name.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "Numeric suite ID. Required for projects in multi-suite mode (`suite_mode` 3 in **List Projects**); omit for single-suite projects. Use **Get Metadata** with resource `suites` to list a project's suites.",
      optional: true,
    },
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "Numeric section ID. Use **List Sections** to find it by section name.",
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Numeric test run ID. Use **List Runs** to find it by run name.",
    },
    testId: {
      type: "integer",
      label: "Test ID",
      description: "Numeric TEST ID: a test is a case inside a specific run, so it differs from the case ID. Get it from **List Tests**.",
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of items to return (default 250, hard cap 1000). The tool follows TestRail's pagination (250 per page) until it has this many.",
      optional: true,
      min: 1,
      max: 1000,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return for each item (`id` is always included). Pass only what you need to keep responses small.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      let url = (this.$auth.api_url || "").trim().replace(/\/+$/, "");
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url;
    },
    _auth() {
      return {
        username: this.$auth.username,
        password: this.$auth.api_key,
      };
    },
    // TestRail routes through the query string (`index.php?/api/v2/<verb>`), which
    // @pipedream/platform's axios wrapper cannot parse, so use plain axios here.
    async _makeRequest({
      path, params, ...opts
    }) {
      try {
        const response = await axios({
          url: `${this._baseUrl()}/index.php?/api/v2/${path}`,
          auth: this._auth(),
          params,
          ...opts,
        });
        return response.data;
      } catch (err) {
        const detail = err.response?.data?.error;
        if (detail) {
          throw new Error(`TestRail API error (HTTP ${err.response.status}): ${detail}`);
        }
        throw err;
      }
    },
    /**
     * Pull the item array out of a list response. TestRail returns either a bare
     * array (older servers / small lookups) or a paginated envelope
     * `{ offset, limit, size, _links, <resource>: [...] }`.
     */
    itemsOf(response, resourceKey) {
      if (Array.isArray(response)) {
        return response;
      }
      if (resourceKey && Array.isArray(response?.[resourceKey])) {
        return response[resourceKey];
      }
      const found = Object.values(response ?? {}).find(Array.isArray);
      return found ?? [];
    },
    /**
     * Suite IDs to query for a project. TestRail rejects get_cases / get_sections
     * without `suite_id` on multi-suite projects (suite_mode 3), so when the caller
     * gave none, expand to every suite of the project (first 20). Single-suite
     * projects return [undefined]: no suite_id is sent.
     */
    async resolveSuiteIds({
      $, projectId, suiteId,
    }) {
      if (suiteId) {
        return [
          suiteId,
        ];
      }
      const project = await this._makeRequest({
        $,
        path: `get_project/${projectId}`,
      });
      if (project.suite_mode !== 3) {
        return [
          undefined,
        ];
      }
      const response = await this._makeRequest({
        $,
        path: `get_suites/${projectId}`,
      });
      return this.itemsOf(response, "suites").slice(0, 20)
        .map((suite) => suite.id);
    },
    /**
     * GET a list endpoint and follow `offset` pagination until `max` items are
     * collected or the last page is reached.
     */
    async paginate({
      $, path, resourceKey, params = {}, max = 250,
    }) {
      const cap = Math.min(max || 250, 1000);
      const items = [];
      let offset = params.offset || 0;
      let hasMore = false;
      while (items.length < cap) {
        const response = await this._makeRequest({
          $,
          path,
          params: {
            ...params,
            limit: Math.min(250, cap - items.length),
            offset,
          },
        });
        const page = this.itemsOf(response, resourceKey);
        items.push(...page);
        hasMore = !Array.isArray(response) && Boolean(response?._links?.next);
        if (!hasMore || !page.length) {
          break;
        }
        offset += page.length;
      }
      return {
        items,
        hasMore,
      };
    },
  },
};
