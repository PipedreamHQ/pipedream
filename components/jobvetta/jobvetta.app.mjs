import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jobvetta",
  propDefinitions: {
    q: {
      type: "string",
      label: "Role or Keyword",
      description: "Role title, skill, or keyword query, e.g. `Senior Data Engineer` or `Python`",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Optional city, state, or country filter, e.g. `New York` or `United States`",
      optional: true,
    },
    remote: {
      type: "boolean",
      label: "Remote Only",
      description: "Set to `true` to return only remote-eligible job openings",
      optional: true,
    },
    days: {
      type: "integer",
      label: "Posted Within Days",
      description: "Restrict results to openings published within the last N days (1 to 365)",
      min: 1,
      max: 365,
      default: 30,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return (1 to 25 on Free tier, up to 100 on paid plans)",
      min: 1,
      max: 100,
      default: 20,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jobvetta.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    searchJobs({
      remote, ...opts
    } = {}) {
      return this._makeRequest({
        path: remote
          ? "/jobs/remote"
          : "/jobs",
        ...opts,
      });
    },
    getCompanyJobs({
      company, ...opts
    }) {
      return this._makeRequest({
        path: `/companies/${encodeURIComponent(company)}/jobs`,
        ...opts,
      });
    },
    estimateSalary(opts = {}) {
      return this._makeRequest({
        path: "/jobs/salary-estimate",
        ...opts,
      });
    },
    getJobDetails({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
  },
};
