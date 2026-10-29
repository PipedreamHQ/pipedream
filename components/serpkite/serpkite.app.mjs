import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "serpkite",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "The search query.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code used to localize results, such as `us` or `gb`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for results, such as `en` or `de`.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City-level location, such as `Austin, Texas, United States`.",
      optional: true,
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "Requested results, from 1 to 100. Counts above 10 round up to whole pages and cost more credits ([see pricing](https://serpkite.com/pricing)).",
      min: 1,
      max: 100,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Result page, from 1 to 10.",
      min: 1,
      max: 10,
      optional: true,
    },
    time: {
      type: "string",
      label: "Time Window",
      description: "Restrict results to the selected time window.",
      optional: true,
      options: [
        "hour",
        "day",
        "week",
        "month",
        "year",
      ],
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "Only return results from these sources: a domain (`example.com`, subdomains match), a path prefix (`github.com/org`) or a TLD (`.gov`).",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Drop results from these sources: a domain, a path prefix or a TLD.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A public HTTP or HTTPS URL.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The message to the assistant, up to 4,000 characters.",
    },
    track: {
      type: "string[]",
      label: "Track",
      description: "Brands (`Acme`) or domains (`acme.com`) to check the answer for, up to 20. Each comes back in `mentions`: whether the answer names it and whether a cited source is on it.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The `id` returned when the task was started.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.serpkite.com/v1";
    },
    _makeRequest({
      $ = this, path, method = "POST", ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    // Drops unset props so the API only sees the fields the user chose.
    cleanBody(body) {
      const isSet = (value) => value !== undefined && value !== null && value !== ""
        && !(Array.isArray(value) && !value.length);
      return Object.fromEntries(Object.entries(body).filter((entry) => isSet(entry[1])));
    },
    post({
      path, data, ...opts
    }) {
      return this._makeRequest({
        path,
        data: this.cleanBody(data),
        ...opts,
      });
    },
    // AI assistants answer in seconds (Brave) to under a minute; the API gives up after 90 s.
    askAssistant({
      assistant, ...opts
    }) {
      return this.post({
        path: `/${assistant}`,
        timeout: 120000,
        ...opts,
      });
    },
    getCrawl({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/crawl/${taskId}`,
        ...opts,
      });
    },
    getResearch({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/research/${taskId}`,
        ...opts,
      });
    },
  },
};
