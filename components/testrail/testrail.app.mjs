import axios from "axios";

export default {
  type: "app",
  app: "testrail",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Numeric TestRail project id. Ids differ per instance — never guess or reuse an id from an example; use **List Projects** to find it by project name.",
    },
    suiteId: {
      type: "integer",
      label: "Suite ID",
      description: "Numeric suite id (never guess; get it from **List Suites**). **Required in multi-suite projects** (`suite_mode` 3 in **List Projects**); omit for single-suite projects. Use **List Suites** to find it.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Numeric test run id. Use **List Runs** to find it by run name.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum items to return in this page (default 100, max 250). If `next_offset` in the response is not null, call again with `offset` set to it to get more — results are never silently truncated.",
      optional: true,
      min: 1,
      max: 250,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of items to skip (default 0). Pass the previous response's `next_offset`.",
      optional: true,
      min: 0,
    },
  },
  methods: {
    _baseUrl() {
      // $auth.api_url is the instance URL, e.g. https://acme.testrail.io (users sometimes
      // paste it without the scheme or with a trailing slash / index.php).
      let url = (this.$auth.api_url || "").trim();
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url.replace(/\/+$/, "").replace(/\/index\.php.*$/i, "");
    },
    /**
     * TestRail's API is query-routed: `index.php?/api/v2/<verb>/<ids>&<params>`.
     * Parameters therefore follow an `&`, not a `?`, so the URL is built by hand.
     */
    _url(path, params = {}) {
      const query = Object.entries(params)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && value !== "")
        .map(([
          key,
          value,
        ]) => `${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value)
          ? value.join(",")
          : value)}`)
        .join("&");
      return `${this._baseUrl()}/index.php?/api/v2/${path}${query
        ? `&${query}`
        : ""}`;
    },
    async _makeRequest({
      // eslint-disable-next-line no-unused-vars
      $, path, params, ...opts
    }) {
      // Plain axios on purpose: @pipedream/platform's axios rewrites the query string into
      // a params object, which mangles TestRail's `index.php?/api/v2/...` routing.
      try {
        const { data } = await axios({
          url: this._url(path, params),
          auth: {
            username: this.$auth.username,
            password: this.$auth.api_key,
          },
          headers: {
            "Content-Type": "application/json",
          },
          ...opts,
        });
        return data;
      } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data?.error ?? err.message;
        throw new Error(`TestRail API error${status
          ? ` (HTTP ${status})`
          : ""}: ${detail}`);
      }
    },
    getProjects(args = {}) {
      return this._makeRequest({
        path: "get_projects",
        ...args,
      });
    },
    getSuites({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `get_suites/${projectId}`,
        ...args,
      });
    },
    getStatuses(args = {}) {
      return this._makeRequest({
        path: "get_statuses",
        ...args,
      });
    },
    getCaseFields(args = {}) {
      return this._makeRequest({
        path: "get_case_fields",
        ...args,
      });
    },
    getResultFields(args = {}) {
      return this._makeRequest({
        path: "get_result_fields",
        ...args,
      });
    },
    getCaseTypes(args = {}) {
      return this._makeRequest({
        path: "get_case_types",
        ...args,
      });
    },
    getPriorities(args = {}) {
      return this._makeRequest({
        path: "get_priorities",
        ...args,
      });
    },
    getTemplates({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `get_templates/${projectId}`,
        ...args,
      });
    },
    getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `get_user/${userId}`,
        ...args,
      });
    },
    getUserByEmail(args = {}) {
      return this._makeRequest({
        path: "get_user_by_email",
        ...args,
      });
    },
    getRuns({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `get_runs/${projectId}`,
        ...args,
      });
    },
    addRun({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_run/${projectId}`,
        ...args,
      });
    },
    closeRun({
      runId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `close_run/${runId}`,
        ...args,
      });
    },
    getTests({
      runId, ...args
    }) {
      return this._makeRequest({
        path: `get_tests/${runId}`,
        ...args,
      });
    },
    getTest({
      testId, ...args
    }) {
      return this._makeRequest({
        path: `get_test/${testId}`,
        ...args,
      });
    },
    getResults({
      testId, ...args
    }) {
      return this._makeRequest({
        path: `get_results/${testId}`,
        ...args,
      });
    },
    getResultsForRun({
      runId, ...args
    }) {
      return this._makeRequest({
        path: `get_results_for_run/${runId}`,
        ...args,
      });
    },
    addResult({
      testId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_result/${testId}`,
        ...args,
      });
    },
    addResultForCase({
      runId, caseId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_result_for_case/${runId}/${caseId}`,
        ...args,
      });
    },
    addResultsForCases({
      runId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_results_for_cases/${runId}`,
        ...args,
      });
    },
    getSections({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `get_sections/${projectId}`,
        ...args,
      });
    },
    addSection({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_section/${projectId}`,
        ...args,
      });
    },
    getCases({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `get_cases/${projectId}`,
        ...args,
      });
    },
    getCase({
      caseId, ...args
    }) {
      return this._makeRequest({
        path: `get_case/${caseId}`,
        ...args,
      });
    },
    addCase({
      sectionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `add_case/${sectionId}`,
        ...args,
      });
    },
    updateCase({
      caseId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `update_case/${caseId}`,
        ...args,
      });
    },
  },
};
