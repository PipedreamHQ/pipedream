import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "logbrew",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "The LogBrew project to watch or write to",
      async options() {
        const projects = await this.listProjects();
        return projects
          .filter((project) => project.is_active !== false)
          .map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    issueId: {
      type: "string",
      label: "Issue",
      description: "The issue to change. Pick an unresolved issue from the list, or pass an issue ID from a LogBrew trigger.",
      async options({ projectId }) {
        const issues = await this.listIssues({
          params: {
            project_id: projectId,
            status: "unresolved",
            limit: 100,
          },
        });
        return issues.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return (this.$auth.api_url || "https://api.logbrew.co").replace(/\/+$/, "");
    },
    _dashboardUrl() {
      const url = new URL(this._apiUrl());
      const host = url.host.startsWith("api.")
        ? url.host.slice("api.".length)
        : url.host;
      return `${url.protocol}//${host}`;
    },
    _makeRequest({
      $ = this, path, token = this.$auth.api_token, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...opts,
      });
    },
    /**
     * Adds the LogBrew dashboard link to an issue
     * @param {object} issue - An issue from the LogBrew API
     * @returns {object} The issue with a `url` field
     */
    withUrl(issue) {
      return {
        ...issue,
        url: `${this._dashboardUrl()}/dashboard/issues/${encodeURIComponent(issue.id)}`,
      };
    },
    /**
     * Lists the projects the API token can read
     * @param {object} opts - Request options
     * @returns {Promise<object[]>} Projects with `id`, `name`, and `is_active`
     */
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/api/projects",
        ...opts,
      });
    },
    /**
     * Lists grouped issues, most recently seen first
     * @param {object} opts - Request options, with `params` such as `project_id`,
     *   `status`, `since`, and `limit` (1 to 500)
     * @returns {Promise<object[]>} Issues
     */
    listIssues(opts = {}) {
      return this._makeRequest({
        path: "/api/telemetry/issues",
        ...opts,
      });
    },
    /**
     * Lists the alert rules of a project with the time each one last fired
     * @param {object} opts - Request options with `projectId`
     * @returns {Promise<object[]>} Alert rules
     */
    async listAlertRules({
      projectId, ...opts
    }) {
      const { rules } = await this._makeRequest({
        path: `/api/projects/${encodeURIComponent(projectId)}/alert-rules`,
        ...opts,
      });
      return rules;
    },
    /**
     * Changes the status, priority, or assignee of an issue
     * @param {object} opts - Request options with `issueId` and `data`
     * @returns {Promise<object>} The updated issue
     */
    updateIssue({
      issueId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/api/telemetry/issues/${encodeURIComponent(issueId)}`,
        params: {
          response_version: 5,
        },
        ...opts,
      });
    },
    /**
     * Sends telemetry for one project with the connection's ingest key
     * @param {object} opts - Request options with the envelope in `data`
     * @returns {Promise<object>} Counts of the accepted items
     */
    ingest(opts = {}) {
      if (!this.$auth.ingest_key) {
        throw new ConfigurationError("Ingest key missing. Add one to your LogBrew connection to send logs.");
      }
      return this._makeRequest({
        method: "POST",
        path: "/api/telemetry/ingest",
        token: this.$auth.ingest_key,
        ...opts,
      });
    },
  },
};
