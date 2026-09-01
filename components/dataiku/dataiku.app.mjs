// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dataiku",
  propDefinitions: {
    projectKey: {
      type: "string",
      label: "Project Key",
      description: "The key of the DSS project, e.g. `MYPROJECT`. Call **List Projects** and pass the `projectKey` field of the project you want. This is an identifier, not the project's display name — a display name will not resolve. In the Dataiku DSS GUI the same value appears in the project's URL as `/projects/MYPROJECT/`.",
    },
    scenarioId: {
      type: "string",
      label: "Scenario ID",
      description: "The ID of the scenario within the project, e.g. `STEPS_SCENARIO`. Call **List Scenarios** and pass the `id` field of the scenario you want — a scenario also has a separate `name` (its display label), which this prop does not accept.",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a job in the project, e.g. `build_something_2016_02_10_21_23_34`. **Build Dataset** returns this as the `id` field of its response; **List Jobs** returns it as `jobId`.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Only return items carrying at least one of these tags, e.g. `[\"production\", \"finance\"]`. Omit to return everything the API key can read.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url.replace(/\/+$/, "")}/public/api`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects/",
        ...opts,
      });
    },
    listDatasets({
      projectKey, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/datasets/`,
        ...opts,
      });
    },
    listScenarios({
      projectKey, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/scenarios/`, // Explicitly include the trailing slash, or else it throws 404 from dataiku
        ...opts,
      });
    },
    runScenario({
      projectKey, scenarioId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/scenarios/${encodeURIComponent(scenarioId)}/run`,
        method: "POST",
        ...opts,
      });
    },
    listScenarioRuns({
      projectKey, scenarioId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/scenarios/${encodeURIComponent(scenarioId)}/get-last-runs/`,
        ...opts,
      });
    },
    runJob({
      projectKey, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/jobs/`, // Explicitly include the trailing slash, or else it throws 404 from dataiku
        method: "POST",
        ...opts,
      });
    },
    listJobs({
      projectKey, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/jobs/`,
        ...opts,
      });
    },
    getJob({
      projectKey, jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${encodeURIComponent(projectKey)}/jobs/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
  },
};
