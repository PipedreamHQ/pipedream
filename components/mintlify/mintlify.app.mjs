// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mintlify",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain identifier from your domain.mintlify.app URL. Can be found in the top left of your dashboard.",
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Start date to filter by, in ISO 8601 or `YYYY-MM-DD` format (e.g. `2024-01-01`). Inclusive.",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "End date to filter by, in ISO 8601 or `YYYY-MM-DD` format. Exclusive — results on this date itself are not included.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page. Defaults to 50.",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque pagination cursor from a previous response's `nextCursor` field. Omit to fetch the first page.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-dsc.mintlify.com/v1";
    },
    _adminBaseUrl() {
      return "https://api.mintlify.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.assistant_api_key}`,
        },
        ...opts,
      });
    },
    _makeAdminRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._adminBaseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.admin_api_key}`,
        },
        ...opts,
      });
    },
    triggerUpdate(opts = {}) {
      return this._makeAdminRequest({
        path: `/project/update/${this.$auth.project_id}`,
        method: "POST",
        ...opts,
      });
    },
    getUpdateStatus({
      statusId, ...opts
    }) {
      return this._makeAdminRequest({
        path: `/project/update-status/${statusId}`,
        ...opts,
      });
    },
    triggerPreviewDeployment(opts = {}) {
      return this._makeAdminRequest({
        path: `/project/preview/${this.$auth.project_id}`,
        method: "POST",
        ...opts,
      });
    },
    detectAiProse(opts = {}) {
      return this._makeAdminRequest({
        path: `/deslop/${this.$auth.project_id}`,
        method: "POST",
        ...opts,
      });
    },
    getPageViews(opts = {}) {
      return this._makeAdminRequest({
        path: `/analytics/${this.$auth.project_id}/views`,
        ...opts,
      });
    },
    getSearchQueries(opts = {}) {
      return this._makeAdminRequest({
        path: `/analytics/${this.$auth.project_id}/searches`,
        ...opts,
      });
    },
    getUserFeedback(opts = {}) {
      return this._makeAdminRequest({
        path: `/analytics/${this.$auth.project_id}/feedback`,
        ...opts,
      });
    },
    searchDocumentation({
      domain, ...opts
    }) {
      return this._makeRequest({
        path: `/search/${domain}`,
        method: "POST",
        ...opts,
      });
    },
    chatWithAssistant({
      domain, ...opts
    }) {
      return this._makeRequest({
        path: `/assistant/${domain}/message`,
        method: "POST",
        ...opts,
      });
    },
  },
};
