import { axios } from "@pipedream/platform";

import { cleanObject } from "./common/utils.mjs";

export default {
  type: "app",
  app: "super_carl",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "Natural-language search query, for example `Head of Growth candidates in NYC warm through my network`.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Optional Super Carl AdvancedFilters JSON object. Use this for structured title, company, location, network, post, or company-search filters.",
      optional: true,
    },
    delegateUserId: {
      type: "string",
      label: "Delegate User ID",
      description: "Optional team-seat user ID to search as. The API key owner must be allowed to delegate to this user.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 10,
      min: 1,
      max: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip.",
      optional: true,
      default: 0,
      min: 0,
    },
    previewLimit: {
      type: "integer",
      label: "Preview Limit",
      description: "Maximum number of preview rows to return.",
      optional: true,
      default: 10,
      min: 1,
      max: 25,
    },
    evidenceFormat: {
      type: "string",
      label: "Evidence Format",
      description: "Evidence detail to return for full people search results.",
      optional: true,
      default: "reasons",
      options: [
        "none",
        "reasons",
        "text",
        "json",
        "both",
      ],
    },
    relationshipDetail: {
      type: "string",
      label: "Relationship Detail",
      description: "Relationship detail to return for people search results.",
      optional: true,
      default: "none",
      options: [
        "none",
        "summary",
        "intro_paths",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.supercarl.ai";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "X-API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getNetworkSummary(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/network/summary",
        ...opts,
      });
    },
    searchPeople({
      preview = true, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: preview
          ? "/api/v1/search/people/preview"
          : "/api/v1/search/people",
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/companies/search/preview",
        ...opts,
      });
    },
    searchJobs({
      withPeople = false, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: withPeople
          ? "/api/v1/search/jobs/with-people"
          : "/api/v1/search/jobs/preview",
        ...opts,
      });
    },
    searchPosts({
      withPeople = false, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: withPeople
          ? "/api/v1/search/posts/with-people"
          : "/api/v1/search/posts/preview",
        ...opts,
      });
    },
    cleanPayload(payload = {}) {
      return cleanObject(payload);
    },
  },
};
