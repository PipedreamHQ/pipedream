import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jobspipe",
  propDefinitions: {
    jobTitleOr: {
      type: "string[]",
      label: "Job Title Contains",
      description: "Match jobs whose title contains any of these phrases (e.g. `Software Engineer`, `Data Scientist`). Mapped to `job_title_or`.",
      optional: true,
    },
    jobTitleNot: {
      type: "string[]",
      label: "Job Title Excludes",
      description: "Exclude jobs whose title contains any of these phrases (e.g. `Intern`, `Manager`). Mapped to `job_title_not`.",
      optional: true,
    },
    descriptionOr: {
      type: "string[]",
      label: "Description Contains",
      description: "Match jobs whose description contains every word of any one of these phrases (e.g. `machine learning`, `visa sponsorship`). Mapped to `description_or`.",
      optional: true,
    },
    countryCodes: {
      type: "string[]",
      label: "Country Codes",
      description: "ISO alpha-2 country codes to include (e.g. `US`, `GB`, `DE`). Mapped to `job_country_code_or`.",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "City or region substrings (e.g. `Seattle`, `London`). Mapped to `job_location_or`.",
      optional: true,
    },
    cities: {
      type: "string[]",
      label: "Cities",
      description: "Whole city names (e.g. `Munich`, `London`). Mapped to `city_or`.",
      optional: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "Skill slugs to match any of (e.g. `python`, `react`, `kubernetes`). Mapped to `skills_or`.",
      optional: true,
    },
    companyNames: {
      type: "string[]",
      label: "Company Names",
      description: "Company names to match (normalized; e.g. `Stripe`, `Amazon`). Mapped to `company_name_or`.",
      optional: true,
    },
    remote: {
      type: "boolean",
      label: "Remote Only",
      description: "Set `true` for remote-only roles, `false` to exclude remote. Leave unset for both.",
      optional: true,
    },
    employmentTypes: {
      type: "string[]",
      label: "Employment Types",
      description: "Match any of these employment types (e.g. `full-time`, `contract`). Mapped to `employment_type_or`.",
      options: [
        "full-time",
        "part-time",
        "contract",
        "temporary",
        "internship",
      ],
      optional: true,
    },
    workArrangements: {
      type: "string[]",
      label: "Work Arrangements",
      description: "Match any of these work arrangements (e.g. `remote`, `hybrid`). Mapped to `work_arrangement_or`.",
      options: [
        "remote",
        "hybrid",
        "onsite",
      ],
      optional: true,
    },
    seniorityLevels: {
      type: "string[]",
      label: "Seniority Levels",
      description: "Match any of these seniority levels (e.g. `senior`, `lead`). Mapped to `job_seniority_or`.",
      options: [
        "entry",
        "mid",
        "senior",
        "lead",
        "exec",
      ],
      optional: true,
    },
    postedAtMaxAgeDays: {
      type: "integer",
      label: "Posted Within Days",
      description: "Only return postings newer than this many days (e.g. `7` for the last week). Mapped to `posted_at_max_age_days`.",
      optional: true,
      min: 1,
    },
    minSalaryUsd: {
      type: "integer",
      label: "Minimum Salary (USD)",
      description: "Only jobs whose posted salary reaches this annual USD amount (e.g. `120000`). Mapped to `min_salary_usd`.",
      optional: true,
      min: 0,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return. Defaults to `25`; capped by your JobsPipe plan page size.",
      optional: true,
      default: 25,
      min: 1,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Lifecycle filter. Defaults to `active`.",
      options: [
        "active",
        "closed",
        "any",
      ],
      optional: true,
      default: "active",
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque pagination cursor for the next page. Use the `metadata.next_cursor` value returned by a previous **Search Jobs** run (e.g. `eyJvZmZzZXQiOjI1fQ`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jobspipe.dev";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    searchJobs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/jobs/search",
        ...opts,
      });
    },
  },
};
