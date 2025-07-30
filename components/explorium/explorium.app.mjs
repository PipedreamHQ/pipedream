import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "explorium",
  propDefinitions: {
    name: {
      type: "string",
      label: "Business Name",
      description: "Filter by company name",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "A two-letter country code (ISO Alpha-2 format)",
      optional: true,
    },
    size: {
      type: "string[]",
      label: "Size",
      description: "Filter by company size range",
      options: constants.COMPANY_SIZE_RANGES,
      optional: true,
    },
    revenue: {
      type: "string[]",
      label: "Revenue",
      description: "Filter by company revenue range",
      options: constants.COMPANY_REVENUE_RANGES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.explorium.ai/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          api_key: this.$auth.api_key,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      partnerId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${partnerId}`,
        method: "DELETE",
        ...opts,
      });
    },
    enrollBusinesses(opts = {}) {
      return this._makeRequest({
        path: "/businesses/events/enrollments",
        method: "POST",
        ...opts,
      });
    },
    enrollProspects(opts = {}) {
      return this._makeRequest({
        path: "/prospects/enrollments",
        method: "POST",
        ...opts,
      });
    },
    matchBusinessId(opts = {}) {
      return this._makeRequest({
        path: "/businesses/match",
        method: "POST",
        ...opts,
      });
    },
    matchProspectId(opts = {}) {
      return this._makeRequest({
        path: "/prospects/match",
        method: "POST",
        ...opts,
      });
    },
    fetchBusinesses(opts = {}) {
      return this._makeRequest({
        path: "/businesses",
        method: "POST",
        ...opts,
      });
    },
    fetchProspects(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        method: "POST",
        ...opts,
      });
    },
    enrichBusiness({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/businesses/${type}/enrich`,
        method: "POST",
        ...opts,
      });
    },
    enrichProspect({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/prospects/${type}/enrich`,
        method: "POST",
        ...opts,
      });
    },
  },
};
