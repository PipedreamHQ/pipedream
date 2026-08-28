// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  CASE_OWNER,
  KBN_XSRF_VALUE,
  MIN_LIMIT,
  PER_PAGE_MAX,
  SEVERITIES,
  CASE_STATUSES,
  OBJECT_TYPES,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "elastic_security",
  propDefinitions: {
    id: {
      type: "string",
      label: "Rule ID",
      description: "The Kibana internal UUID of the detection rule (e.g. `5f8c1a2b-3d4e-5f6a-7b8c-9d0e1f2a3b4c`). Run **Find Detection Rules** first to obtain valid IDs.",
    },
    ruleId: {
      type: "string",
      label: "Rule ID (User-defined)",
      description: "The user-defined stable rule identifier (`rule_id`). Run **Find Detection Rules** first to obtain valid `rule_id` values.",
    },
    caseId: {
      type: "string",
      label: "Case ID",
      description: "The ID of the case. Run **Find Cases** first to obtain valid case IDs.",
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "Severity level. One of: `low`, `medium`, `high`, `critical`.",
      options: SEVERITIES,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags. Run **List Tags** first to see existing tags and avoid creating near-duplicates.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Case status. One of: `open`, `in-progress`, `closed`.",
      options: CASE_STATUSES,
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object: a case or a detection rule.",
      options: OBJECT_TYPES,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number of results to return, starting at 1. Defaults to 1."
        + " If the response's `total` field exceeds `page × perPage`, more results exist — call again with `page` incremented by 1 to fetch them.",
      optional: true,
      min: MIN_LIMIT,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results per page. Maximum 100. Defaults to 20. See **Page** for how to fetch additional pages.",
      optional: true,
      min: MIN_LIMIT,
      max: PER_PAGE_MAX,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Field to sort results by.",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort direction: `asc` or `desc`.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Only include these fields in each returned result, to reduce response size. Omit to return the full object(s).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.api_url.replace(/\/$/, "");
    },
    async _makeRequest({
      $ = this, path, headers, method = "GET", ...args
    }) {
      const xsrfHeaders = method.toUpperCase() !== "GET"
        ? {
          "kbn-xsrf": KBN_XSRF_VALUE,
        }
        : {};
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: {
          "authorization": `ApiKey ${this.$auth.api_key}`,
          ...xsrfHeaders,
          ...headers,
        },
        ...args,
      });
    },
    async findDetectionRules({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/api/detection_engine/rules/_find",
        params,
      });
    },
    async getDetectionRule({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/api/detection_engine/rules",
        params,
      });
    },
    async createDetectionRule({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/detection_engine/rules",
        data,
      });
    },
    async updateDetectionRule({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: "/api/detection_engine/rules",
        data,
      });
    },
    async deleteDetectionRule({
      $, params,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: "/api/detection_engine/rules",
        params,
      });
    },
    async runDetectionRules({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/detection_engine/rules/_bulk_action",
        data,
      });
    },
    async searchAlerts({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/detection_engine/signals/search",
        data,
      });
    },
    async updateAlertStatus({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/detection_engine/signals/status",
        data,
      });
    },
    async createCase({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/cases",
        data,
      });
    },
    async getCase({
      $, caseId,
    }) {
      return this._makeRequest({
        $,
        path: `/api/cases/${caseId}`,
      });
    },
    async findCases({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/api/cases/_find",
        params,
      });
    },
    async updateCase({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: "/api/cases",
        data,
      });
    },
    async deleteCase({
      $, params,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: "/api/cases",
        params,
      });
    },
    async addCaseComment({
      $, caseId, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/api/cases/${caseId}/comments`,
        data,
      });
    },
    async listCaseTags({ $ }) {
      return this._makeRequest({
        $,
        path: "/api/cases/tags",
        params: {
          owner: CASE_OWNER,
        },
      });
    },
    // Returns users who have reported (created) cases, not every org user or every
    // assignment-eligible user — Kibana has no public endpoint for either of those.
    async listCaseReporters({ $ }) {
      return this._makeRequest({
        $,
        path: "/api/cases/reporters",
        params: {
          owner: CASE_OWNER,
        },
      });
    },
    async listRuleTags({ $ }) {
      return this._makeRequest({
        $,
        path: "/api/detection_engine/tags",
      });
    },
  },
};
